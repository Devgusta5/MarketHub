/**
 * Cena WebGL da Home espacial — §6.9.
 *
 * O DOM trava com alguns milhares de nós; o mestre pede escala de
 * milhares de produtos. Aqui o canvas só DESENHA: não recebe clique,
 * não recebe foco e não é lido por leitor de tela.
 *
 * Toda a interação acessível vive na camada DOM espelhada, em
 * `universe.tsx`. É ela que o Tab percorre e o leitor de tela anuncia
 * (§39.1 exige navegação alternativa).
 *
 * Este módulo não importa React de propósito: é só cena.
 */
import {
  Application,
  Assets,
  Container,
  Graphics,
  Rectangle,
  Sprite,
  Texture,
} from 'pixi.js'

export type SceneNode = {
  id: string
  x: number
  y: number
  imageUrl: string | null
  /** Marcador laranja no canto: precisa de atenção. */
  flagged: boolean
}

export type View = { x: number; y: number; z: number }

const BUBBLE = 88
const RADIUS = BUBBLE / 2

export class UniverseScene {
  private app: Application | null = null
  private world = new Container()
  private sprites = new Map<string, Container>()
  private destroyed = false

  async mount(host: HTMLElement, onReady: () => void): Promise<void> {
    const app = new Application()
    await app.init({
      resizeTo: host,
      backgroundAlpha: 0,
      antialias: true,
      // Acima de 2 o custo de memória cresce sem ganho visível.
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
      preference: 'webgl',
    })

    // O componente pode ter desmontado durante o init assíncrono.
    if (this.destroyed) {
      app.destroy(true, { children: true })
      return
    }

    // O canvas é decoração: a camada DOM por cima é que interage.
    app.canvas.setAttribute('aria-hidden', 'true')
    app.canvas.style.pointerEvents = 'none'
    app.stage.eventMode = 'none'

    host.appendChild(app.canvas)
    // Culling: o Pixi pula o que está fora da tela em vez de processar
    // todos os filhos a cada quadro.
    this.world.cullable = true
    this.world.cullableChildren = true
    app.stage.addChild(this.world)
    this.app = app
    onReady()
  }

  destroy(): void {
    this.destroyed = true
    for (const texture of Object.values(this.discs)) texture.destroy(true)
    this.discs = {}
    this.sprites.clear()
    this.app?.destroy(true, { children: true })
    this.app = null
  }

  get ready(): boolean {
    return this.app !== null
  }

  /** Desenha ou atualiza os nós. Reaproveita o que já existe. */
  async sync(nodes: SceneNode[], visible: Set<string>): Promise<void> {
    if (!this.app) return

    const seen = new Set<string>()

    for (const node of nodes) {
      seen.add(node.id)
      let bubble = this.sprites.get(node.id)

      if (!bubble) {
        bubble = await this.createBubble(node)
        if (!this.app) return // destruído durante o await
        this.world.addChild(bubble)
        this.sprites.set(node.id, bubble)
      }

      bubble.x = node.x
      bubble.y = node.y
      // Filtrado some, mas continua na cena: refiltrar não recria nada.
      bubble.visible = visible.has(node.id)
    }

    // Produto removido sai da cena.
    for (const [id, sprite] of this.sprites) {
      if (!seen.has(id)) {
        sprite.destroy({ children: true })
        this.sprites.delete(id)
      }
    }
  }

  /**
   * Textura do disco, gerada uma vez e reaproveitada por todas as
   * bolinhas. Um Graphics por bolinha significa milhares de geometrias
   * distintas; um sprite compartilhado entra no mesmo lote de desenho.
   */
  /**
   * Uma textura de disco por tema, geradas sob demanda e guardadas até
   * a cena morrer.
   *
   * Tentei recriar e destruir a antiga na troca de tema: o Pixi quebrava
   * com "Cannot read properties of null (reading 'alphaMode')" porque
   * sprites ainda apontavam para a textura liberada. Duas texturas vivas
   * custam pouco e eliminam a corrida.
   */
  private discs: Partial<Record<'dark' | 'light', Texture>> = {}
  private theme: 'dark' | 'light' = 'dark'

  private getDisc(theme: 'dark' | 'light' = this.theme): Texture {
    const cached = this.discs[theme]
    if (cached) return cached

    // Branco sobre fundo claro perde silhueta: no tema claro o contorno
    // é opaco e ganha um anel escuro de 1px, como no DOM.
    const g = new Graphics().circle(RADIUS, RADIUS, RADIUS - 1).fill({ color: 0xf7f7f6 })
    if (theme === 'light') {
      g.stroke({ width: 2, color: 0xffffff, alpha: 0.95 })
      g.circle(RADIUS, RADIUS, RADIUS).stroke({ width: 1, color: 0x0f0f14, alpha: 0.06 })
    } else {
      g.stroke({ width: 2, color: 0xffffff, alpha: 0.21 })
    }
    const texture = this.app!.renderer.generateTexture(g)
    g.destroy()
    this.discs[theme] = texture
    return texture
  }

  /** Troca os discos quando o tema muda (§5.1). */
  setTheme(theme: 'dark' | 'light'): void {
    if (this.theme === theme || !this.app) return
    this.theme = theme
    const texture = this.getDisc(theme)
    for (const bubble of this.sprites.values()) {
      const disc = bubble.children[0]
      if (disc instanceof Sprite) disc.texture = texture
    }
  }

  private flagTexture: Texture | null = null

  private getFlag(): Texture {
    if (this.flagTexture || !this.app) return this.flagTexture!
    const g = new Graphics()
      .circle(10, 10, 8)
      .fill({ color: 0xff6a00 })
      .stroke({ width: 2, color: 0x1b1c24 })
    this.flagTexture = this.app.renderer.generateTexture(g)
    g.destroy()
    return this.flagTexture
  }

  private async createBubble(node: SceneNode): Promise<Container> {
    const bubble = new Container()

    const disc = new Sprite(this.getDisc())
    disc.anchor.set(0.5)
    bubble.addChild(disc)

    if (node.imageUrl) {
      try {
        const texture: Texture = await Assets.load(node.imageUrl)
        const sprite = new Sprite(texture)
        const scale = (BUBBLE * 0.86) / Math.max(texture.width, texture.height)
        sprite.scale.set(scale)
        sprite.anchor.set(0.5)
        bubble.addChild(sprite)
      } catch {
        // Textura que não carrega deixa o disco neutro — §6.2 pede
        // placeholder, não buraco.
      }
    }

    if (node.flagged) {
      const dot = new Sprite(this.getFlag())
      dot.anchor.set(0.5)
      dot.position.set(RADIUS - 10, -RADIUS + 10)
      bubble.addChild(dot)
    }

    return bubble
  }

  /** Aplica a câmera. Chamado a cada quadro de pan/zoom. */
  setView(view: View): void {
    this.world.position.set(view.x, view.y)
    this.world.scale.set(view.z)
    const screen = this.app?.screen
    if (screen) {
      // Área de culling em coordenadas do mundo.
      this.world.cullArea = new Rectangle(
        -view.x / view.z,
        -view.y / view.z,
        screen.width / view.z,
        screen.height / view.z,
      )
    }
  }

  /** Realce ao voar até um produto pela busca. */
  setFocus(id: string | null): void {
    for (const [nodeId, bubble] of this.sprites) {
      bubble.alpha = id === null || nodeId === id ? 1 : 0.55
    }
  }

  /** Aumenta a bolinha sob o ponteiro, como o hover do DOM fazia. */
  setHover(id: string | null): void {
    for (const [nodeId, bubble] of this.sprites) {
      bubble.scale.set(nodeId === id ? 1.2 : 1)
    }
  }
}
