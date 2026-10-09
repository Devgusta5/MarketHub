# markethub — Plano de execução

> Autoridade: [`docs/DOCUMENTO-MESTRE.md`](docs/DOCUMENTO-MESTRE.md) (v3.0, 08/10/2026).
> Especificação funcional rodando: [`docs/prototipo/markethub_v2.html`](docs/prototipo/markethub_v2.html).
> Em conflito, o mestre manda.

---

## 1. Onde estamos

**Fase A do mestre (§45): refinamento do protótipo.** O HTML v2 existe e valida a UX.
O trabalho atual é **portá-lo para Next.js** — não para "deixar bonito", mas porque
um arquivo HTML de 110 KB não evolui para a Fase B (backend, persistência, filas).

O que o porte entrega que o HTML não entrega:

- Componentes tipados e testáveis, em vez de `innerHTML` com template string.
- Estado em um lugar só, em vez de 20 variáveis globais.
- Fronteira cliente/servidor já desenhada para o backend da Fase B.
- Home espacial em Canvas/WebGL, que o §6.9 pede e o DOM não aguenta.

**O que NÃO muda:** comportamento, fluxo e visual. O protótipo é a referência.

---

## 2. Decisões desta fase

| Decisão | Escolha | Por quê |
|---|---|---|
| Destino | Portar para Next.js | Base real para a Fase B |
| Código Next atual | Só a base técnica (Next 16, TS, tooling) | O mestre revoga Dashboard-como-Home e sidebar fixa |
| Home espacial | **PixiJS (WebGL)** | §6.9 pede escala de milhares; DOM trava antes disso |
| Acessibilidade da Home | Camada DOM espelhada, invisível | WebGL não tem semântica; §39.1 exige teclado e leitor de tela |
| Dados demo | Os 24 produtos do protótipo, placeholder neutro | §6.2 prevê `cover_thumbnail` com placeholder; foto real entra depois |
| Melhorias | As pendências que o próprio mestre aponta | Ver seção 5 |

### Ressalva registrada: WebGL e acessibilidade

Canvas não expõe elementos para leitor de tela nem recebe foco por teclado.
O §39.1 exige "navegação alternativa em lista/grade e busca sem depender do
movimento espacial", e o §44 cobra teclado e leitor de tela.

Solução: **camada DOM espelhada**. Para cada bolinha visível no canvas existe um
`<button>` posicionado, transparente e com rótulo acessível. O leitor de tela e o
Tab operam nessa camada; o canvas só desenha. Mais a visão em lista como rota
alternativa completa.

---

## 3. Arquitetura do porte

```text
app/
├─ (home)/page.tsx          Home espacial — universo de produtos
├─ produto/[id]/            Workspace adaptativo (abas, seções)
└─ layout.tsx               Dock + Launchpad + overlays globais

components/
├─ universe/                PixiJS: cena, bolinhas, pan/zoom, camada a11y
├─ dock/                    Dock flutuante, Launchpad, Atividades
├─ creation/                Janela flutuante, minimizável e arrastável
├─ workspace/               Seções, abas, inspetor contextual
└─ ui/                      Design system (botão, chip, janela, campo...)

lib/
├─ store/                   Estado: produtos, tarefas, criação, preferências
├─ domain/                  Tipos e máquinas de estado do mestre (§38)
└─ artwork/                 SVGs dos produtos de demonstração
```

### Fronteiras já pensadas para a Fase B

- Nenhum componente chama provedor de IA direto. Toda operação passa por
  `lib/operations/` com os contratos do §37 (`analisar_produto`,
  `gerar_imagem`...). Hoje são simulações; na Fase B viram chamadas ao backend.
- Estado persistido em `localStorage` fica atrás de uma interface
  (`lib/store/persistence.ts`). Trocar por Supabase não toca componente.
- **Nenhuma chave de API no cliente, nunca** (§22.2, regra inegociável).

---

## 4. Ordem de implementação

Cada etapa deixa o app navegável.

| # | Etapa | Verificável quando |
|---|---|---|
| 1 | Design system e tokens (dark padrão, gradiente laranja) | Componentes renderizam nos dois temas |
| 2 | Shell: Dock, Launchpad, overlays, atalhos | Navegação entre módulos funciona |
| 3 | Home espacial em PixiJS: malha, pan, zoom, hover | 24 bolinhas, arraste e zoom fluidos |
| 4 | Camada de acessibilidade e visão em lista | Tab percorre produtos; leitor de tela anuncia |
| 5 | Busca híbrida: lista → voar até a bolinha → expandir | Ctrl+K acha e centraliza o produto |
| 6 | Cartão de prévia (expansão animada da bolinha) | Clique abre cartão, fechar volta à origem |
| 7 | Workspace: abas, seções, inspetor | Vários produtos abertos sem duplicar aba |
| 8 | Nova Criação: janela flutuante, minimizar, confirmar | Minimizar não cancela; rascunho recuperável |
| 9 | Central de Atividades e fila simulada | Tarefas progridem sem bloquear a interface |
| 10 | Seções do Workspace: imagens, vídeo, conteúdo, fiscal, histórico | Todas navegáveis com dados demo |
| 11 | Exportação com relatório de exclusões | Só liberados entram; excluídos justificados |
| 12 | Ajustes: integrações (visual), orçamento, aparência | Sem campo de chave real (§22.2) |

---

## 5. Melhorias sobre o protótipo

O mestre aponta estas lacunas; entram no porte:

| Lacuna | Onde o mestre pede | O que faço |
|---|---|---|
| Confiabilidade por atributo | §7.2: Confirmado / Fonte / Provável / Conferir | Cada campo identificado carrega origem e nível |
| Galeria **e** Lista de comandos | §9.3 [APROVADO], HTML só tem grade | As duas visões, alternáveis |
| Comparação de versões | §14.2: lado a lado e deslizador | Comparador no editor de imagem |
| Relatório de exclusões | §17.2: cliente, SKU, canal, motivo, ação, regra | Relatório completo, não só lista |
| Dois eixos de aprovação | §15.1: criativa ≠ liberação por canal | Estados separados na interface |
| Vocabulário "cliente" | §1.1: correção de máxima prioridade | "Cliente", nunca "empresa" para quem é atendido |

### O que permanece simulado, e dito como tal

Nenhuma chamada de IA, nenhum pagamento, nenhuma publicação. A interface diz isso
onde o usuário pode se confundir (§51, regra 4): não declarar conexão, cofre seguro
ou cobrança real onde há apenas demonstração.

---

## 6. Riscos

| Risco | Mitigação |
|---|---|
| WebGL quebra acessibilidade | Camada DOM espelhada + visão em lista (etapa 4, não depois) |
| PixiJS pesado no mobile | Fallback em grade/lista abaixo de certo viewport (§6.9) |
| Porte vira redesign por descuido | O protótipo é a referência; divergência só com decisão registrada |
| Simulação parecer real | Rótulos de demonstração nas telas financeiras e de IA |
| `localStorage` estourar | Já acontece no HTML com imagens; atrás de interface desde o início |

---

## 7. Fora desta fase

Backend, Supabase, autenticação, chamadas reais de IA, cobrança, publicação em
marketplace, usuários individuais e permissões. Tudo isso é Fase B em diante (§45).

O protótipo portado **não prova** capacidade de processar APIs, renderizar 3.000
produtos com qualidade ou entregar SLA. Isso se mede depois, com benchmark (§6.9).
