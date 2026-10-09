# markethub — Documento Mestre do Produto

> **Especificação consolidada de produto, UX, arquitetura técnica, integrações de IA e governança de custos**  
> **Versão:** 3.0 — consolidado e revisado em **08 de outubro de 2026**  
> **Organização proprietária:** **Ecommerce+**  
> **Status:** protótipo interativo **v2 existente**; produto de produção **não implementado**; seleção de provedores e infraestrutura **proposta, não contratada**  
> **Destinação:** referência única para evolução do protótipo e posterior implementação interna  
> **Regra de precedência:** este documento substitui, em caso de conflito, recomendações anteriores dos backups `v1` e `v2`. Decisões expressamente aprovadas pelo usuário têm precedência sobre sugestões do assistente.

---

## Orientação de leitura

Este arquivo é um **backup autossuficiente**, criado a partir do relatório inicial `ia.md`, do planejamento consolidado `v1` e `v2`, das decisões sucessivas da conversa e da existência do protótipo HTML `markethub_prototipo_interativo_v2.html`. Não é um contrato técnico nem um registro de funcionalidades prontas em produção.

**Marcadores usados:**

- **[APROVADO]**: decisão explícita do responsável pelo projeto; não mudar sem nova autorização.
- **[PROPOSTO]**: solução recomendada para desenvolvimento, ainda sujeita a testes/decisão.
- **[EM DEMONSTRAÇÃO]**: componente ou comportamento ilustrado no protótipo HTML local, sem garantia de backend.
- **[PENDENTE]**: definição ainda não encerrada.
- **[FUTURO]**: fora da primeira implementação, porém previsto na arquitetura.
- **[FONTE OFICIAL]**: fato conferido em documentação externa com URL e data de consulta.
- **[ESTIMATIVA]**: hipótese de planejamento, não tarifa contratada nem despesa comprovada.

### Sumário executivo

O **markethub** será um sistema **interno, pertencente exclusivamente à Ecommerce+**, destinado à criação e ao armazenamento de materiais comerciais dos **produtos dos clientes atendidos pela Ecommerce+**. Não haverá uma conta tecnológica independente para cada cliente, nem uma cobrança SaaS por cliente no escopo atual. Os cadastros ficam agrupados logicamente por **cliente → produto → materiais/canais**, com **um orçamento geral de IA e suborçamentos por cliente**.

A **Home** não é um dashboard corporativo e não é uma grade de aplicativos: é uma malha espacial de **bolinhas, uma por produto**, inspirada na navegação do Apple Watch, com fotos dos próprios itens, busca superior flutuante, navegação por arraste e zoom, expansão animada e **Dock inferior** para acessar ferramentas. Nome oficial da marca: **markethub** (minúsculas, conforme aprovado). Tema padrão: **escuro, com gradiente laranja e grafite/preto**; modo claro continua disponível. A Home **não deve ter texto introdutório, título genérico ou mostruário promocional**.

O fluxo principal é **inserir foto/print/link → identificar o produto → confirmar identidade e cliente → criar a bolinha na Home → escolher pacote inteligente e personalizável → autorizar a geração → acompanhar tarefas independentes → editar, revisar e aprovar → exportar somente materiais liberados, com relatório dos excluídos**.

A produção utiliza **Modo Econômico por padrão**: reaproveitamento de arquivos existentes e templates antes de IA generativa paga. Vídeos generativos são **opcionais**, com storyboard editável e autorização adicional. As tarefas não bloqueiam a navegação e podem continuar no servidor, em uma futura implementação funcional. O protótipo HTML atual **simula** esses comportamentos e **não deve receber chaves reais de API**.

---

# PARTE I — IDENTIDADE, NEGÓCIO E DECISÕES IMUTÁVEIS

## 1. Natureza real da organização

### 1.1 Proprietário e usuários

**[APROVADO]** O sistema será operado por uma **única organização: Ecommerce+**. Os diversos clientes/contas de marketplace administrados pela equipe **não são locatários independentes (tenants SaaS)**: são **pastas/entidades lógicas de cliente** dentro da organização.

- Uma conta operacional compartilhada na primeira versão, com todos os funcionários da Ecommerce+ podendo acessar todos os clientes, produtos e marketplaces.
- Os produtos continuam associados ao cliente correto, mas a Home espacial pode exibir todos os produtos em uma malha unificada, aplicando filtros.
- Uma infraestrutura compartilhada de banco, arquivos, filas e provedores de IA, sem chave de API isolada por cliente por padrão.
- O custo de IA será lançado contabilmente ao **cliente beneficiado** pela operação; o pagamento/recarga ao provedor ocorre no nível da Ecommerce+.
- Para o futuro, manter possibilidade de usuários individuais e permissões específicas sem implementá-los agora.

**Correção histórica de máxima prioridade:** referências antigas a "várias empresas proprietárias", "uma conta por cliente" ou "cobrança SaaS por empresa" foram substituídas por **uma Ecommerce+ proprietária e vários clientes gerenciados**. O uso da palavra *empresa* em decisões antigas deve ser interpretado como **cliente/pasta atendida**, salvo quando se referir explicitamente à Ecommerce+.

### 1.2 Objetivo operacional

Reduzir tempo e retrabalho na criação e manutenção de anúncios de **Mercado Livre, Shopee e Amazon**, com possibilidade posterior de novos canais. Entradas: foto original, print, link, documento ou informações básicas. Saídas: imagens, vídeos, títulos, descrições, palavras-chave, dados técnicos e informações fiscais com validação, histórico de versões e arquivos para exportação.

O objetivo não é gerar indiscriminadamente novos materiais para cada item. É oferecer uma **ficha permanente por produto**, identificar quais conteúdos faltam e produzir somente o necessário, com capacidade de revisão humana.

### 1.3 Produto interno, não SaaS

**[APROVADO]** A primeira operação será interna. Planos, assinaturas, faturamento para clientes externos, portais independentes por empresa e multi-tenancy comercial ficam **fora do escopo inicial**. Não confundir faturamento da Ecommerce+ pela gestão de contas com o custo interno das APIs.

### 1.4 Produto em evolução

O planejamento passou por três estágios: concepção funcional (`ia.md`), especificação das três jornadas e **protótipo HTML local v1 → v2**. A etapa atual é **refinar o protótipo** antes de decidir quais APIs efetivamente contratar e implementar.

## 2. Registro canônico das decisões aprovadas

Este quadro é a fonte rápida para evitar regressões em novas versões.

| Domínio | Decisão aprovada |
|---|---|
| Marca | Nome definitivo **markethub**, em minúsculas |
| Propriedade | Uma organização proprietária, **Ecommerce+** |
| Estrutura de clientes | Vários clientes gerenciados dentro da Ecommerce+; dados agrupados por cliente e produto |
| Acesso inicial | Conta operacional compartilhada; todos veem todos os clientes e marketplaces |
| Função principal | Geração, edição, organização e exportação de materiais para anúncios |
| Publicação | **Exportação agora; publicação automática em marketplaces no futuro** |
| Home | Universo espacial de **bolinhas de PRODUTOS**, não de aplicativos |
| Home sem marketing | Sem título introdutório, apresentação genérica ou mostruário promocional |
| Fotos nas bolinhas | Fundo neutro por padrão; capa personalizada opcional |
| Home multi-cliente | Todos os produtos juntos; filtros por cliente e outros atributos |
| Barra superior | Pesquisa flutuante e híbrida, com lista e navegação espacial até o produto |
| Abertura do produto | Expansão animada da bolinha em cartão funcional, com acesso ao Workspace |
| Dock | Flutuante, centralizado embaixo, com ferramentas e ações |
| Ferramentas | Launchpad flutuante e opção de página completa |
| Interação espacial | Arraste livre; roda desloca verticalmente; Ctrl+roda controla zoom; touchpad e controles visuais |
| Temas | Claro e escuro; **escuro como padrão do markethub v2** |
| Cores | Preto/grafite e **gradiente laranja**, mantendo `#FF6A00` como referência |
| Estética | Inspirada em Apple Watch/macOS/Apple Photos e minimalismo de Linear, com identidade própria |
| Animações | Fade-in/fade-out, expansão, microinterações e transições suaves; movimento reduzido |
| Nova criação | Janela flutuante que se expande após identificação para confirmação inteligente |
| Janela minimizável | Clique fora minimiza; miniatura arrastável; minimizar **não cancela** |
| Entrada | Foto, print, link, documentos ou informações básicas |
| Identificação | IA sugere dados; usuário confirma e corrige |
| Momento da bolinha | Aparece após confirmar identidade do produto **e cliente**, antes de gerar materiais |
| Geração | Autorização separada, depois da identificação |
| Modo padrão | **Modo Econômico** |
| Outros modos | Apenas cadastrar e Premium |
| Imagens | **Pacote Inteligente Personalizável**: IA recomenda; usuário escolhe/edita comandos |
| Biblioteca de comandos | Galeria **e** Lista alternáveis; referência original de mais de 80 comandos |
| Edição | Comandos visuais + linguagem natural, combináveis |
| Vídeo | Opcional na confirmação do pacote; Estúdio independente disponível |
| Storyboard | Inteligente e **editável** antes da renderização |
| Conteúdo | Títulos, descrições e SEO **por marketplace** |
| Gerações | Independentes; resultados progressivos, sem esperar todo o pacote |
| Trabalhos simultâneos | Gerenciador inteligente de tarefas e múltiplas criações |
| Fila | Prioridades e concorrência controlada |
| Salvamento | Automático, recuperável; controle de conflitos |
| Retomada de sessão | Abrir na Home e **oferecer** retomar abas/tarefas, sem abrir tudo sozinho |
| Workspace | Adaptativo estilo Apple Pro; **abas inteligentes** entre produtos |
| Organização de materiais | Híbrida: por **tipo de material** ou por **marketplace** |
| Reutilização | Inteligente, com autorização para materiais entre clientes/produtos |
| Aprovação | Individual e em lote |
| Validação | Automática no verificável + análise IA + **aprovação humana** por canal |
| Exportação | Inteligente, com personalização opcional |
| Materiais excluídos | Exportar **apenas liberados**, com relatório de excluídos/pendências |
| Orçamento de IA | Um limite **global Ecommerce+** + limites **por cliente** |
| Forma de consumo | Estimar, reservar, conferir limite, executar, conciliar gasto |
| Bloqueio | Bloquear novas operações pagas ao esgotar limite; trabalhos locais continuam |
| Desbloqueio | Retomar após **recarga confirmada e atualização autorizada do orçamento interno**, mesmo no meio do mês |
| Quem pode pagar | Qualquer usuário **autorizado a realizar o pagamento**; não presumir autorização de pessoa não identificada |
| Recarga | Distribuição automática por **regras e limites pré-configurados** |
| Fila pós-recarga | Retomada de econômicos já autorizados; premium, vídeo e custos alterados exigem reconfirmação |
| Primeira versão de teste | Protótipo interativo com módulos demonstrados, sem APIs reais nem segredos no navegador |
| Painel de chaves | Deve existir visualmente no protótipo; cofre **real só no backend seguro** |
| Plano atual do ChatGPT | Assinatura pessoal **não substitui nem financia** chamadas de API |

## 3. Decisões revogadas ou corrigidas

1. **Home com ícones de aplicativos:** revogada. As bolinhas são **produtos**; aplicativos estão no Dock/Launchpad.
2. **Dashboard comercial como Home:** revogado. Métricas continuam em módulo próprio.
3. **Permissões por funcionário/cliente na primeira versão:** revogado. Há acesso operacional compartilhado a todos os clientes.
4. **Nome da marca em aberto:** revogado. O nome é **markethub**.
5. **Tema claro como inicial:** substituído por **modo escuro de fábrica**, mantendo alternância clara/escura.
6. **Home com cabeçalho promocional e números de demonstração:** removido da experiência desejada.
7. **Só planejamento, nenhum protótipo:** histórico ultrapassado; existem **protótipos HTML v1 e v2**, mas não o produto operacional.
8. **Bloqueio inflexível até o mês seguinte independentemente de recarga:** alterado. A **recarga confirmada com atualização interna autorizada** libera o saldo e retoma tarefas elegíveis.
9. **Empresas como organizações SaaS separadas:** alterado para **uma organização Ecommerce+ e clientes como agrupamentos internos**.
10. **Gerar seis imagens de IA por produto automaticamente:** não aprovado. Seis materiais comerciais podem ser formados com reutilização, templates e só parte de gerações pagas.
11. **Sora como provedor obrigatório:** não aprovado; provedores de vídeo devem ser verificados antes de implementação.
12. **API keys salvas no HTML:** nunca aprovado; a interface de integrações da demo é ilustrativa, não um cofre seguro.

## 4. Princípios de produto e experiência

1. **IA como assistente, não fonte infalível:** dados técnicos/fiscais e características precisam de fonte e validação.
2. **Economia por padrão:** sempre considerar reutilização/template antes de nova geração generativa.
3. **Controle humano:** usuário escolhe, personaliza, confirma e aprova os materiais.
4. **Fluxo não bloqueante:** janelas podem ser minimizadas e tarefas autorizadas continuam no backend futuro.
5. **Sem perda de trabalho:** rascunhos e versões persistentes; fechar interface não significa excluir nem cancelar.
6. **Identidade única:** Home espacial marcante, workspaces internos eficientes e minimalistas.
7. **Sem navegação obrigatória pelo universo:** Dock, Launchpad e busca oferecem atalhos diretos.
8. **Sem custo oculto:** o usuário vê previsão de consumo antes de autorizar operação paga.
9. **Dados pertencem ao cliente correto:** tudo é operado pela Ecommerce+ com atribuição lógica e trilha de origem.
10. **Preparação para evolução:** contratos internos estáveis; publicação em marketplaces e permissões detalhadas ficam para depois.

---

# PARTE II — IDENTIDADE VISUAL E JORNADA 1: EXPLORAR

## 5. Design system do markethub

### 5.1 Branding visual

**[APROVADO]** `markethub`, sempre que possível grafado em minúsculas na interface. Marca interna distinta da Ecommerce+, mas pode herdar a referência cromática laranja. Não apresentar frases genéricas de apresentação na Home.

**Tokens visuais de referência [PROPOSTO]:**

| Token | Valor inicial | Aplicação |
|---|---|---|
| `brand-orange` | `#FF6A00` | Ações principais, foco e progresso |
| `gradient-orange` | `#FF9F41 → #FF6A00 → #E7490E` | Botões ou acentos selecionados |
| `dark-base` | `#0C0D12` | Fundo do tema escuro |
| `dark-surface` | `#1B1C24` | Superfícies elevadas |
| `dark-surface-soft` | `#272830` | Painéis secundários |
| `light-base` | `#F7F7F6` | Fundo do tema claro |
| `light-surface` | `#FFFFFF` | Superfícies claras |
| `text-primary-dark` | próximo ao branco | Legibilidade no tema escuro |
| `text-secondary-dark` | cinza médio-claro | Legendas e estados secundários |

A Home escura terá **gradiente radial/ambiental laranja discreto sobre grafite/preto**, sem prejudicar as cores das fotografias dos produtos. O tema claro terá contraste e acabamento próprios, não será apenas uma inversão de cores.

### 5.2 Tipografia e componentes

- Fonte de aparência Apple: pilha de sistema nativa `-apple-system`, `BlinkMacSystemFont` e fallback adequado; uso da fonte SF Pro apenas quando licenciamento aplicável permitir.
- Títulos curtos e diretos; evitar títulos gigantes de marketing em módulos internos.
- Dock, busca, cartões, janelas e botões com bordas arredondadas, sombras sutis e transparências moderadas.
- Ícones consistentes em traço, tamanho e semântica; nunca depender exclusivamente do ícone para tarefa crítica.
- Área útil de conteúdo adaptável por módulo: galeria, formulário, timeline, grade, editor textual.
- Estados comuns para hover, foco de teclado, disabled, carregamento, sucesso, pendência e erro.

### 5.3 Movimento e animações

**[APROVADO]** A interface deve incluir animações visíveis, inclusive **fade-in e fade-out**, não apenas hover superficial.

**[PROPOSTO]** Regras de duração e comportamento:

| Evento | Referência inicial | Efeito |
|---|---|---|
| Entrada de Home | 180–350 ms | Fade e entrada sutil da busca/Dock |
| Bolinha aparece | 300–650 ms (com escalonamento leve) | Opacidade + escala |
| Hover em bolinha | 120–180 ms | Aumento discreto |
| Pesquisa abre | 150–250 ms | Fade/slide, sem deslocar Home |
| Bolinha expande | 300–450 ms | Continuidade espacial para cartão |
| Cartão fecha | 250–350 ms | Volta à bolinha de origem |
| Workspace entra | 250–400 ms | Fade + mudança de escala suave |
| Janela minimiza | 180–300 ms | Redução para miniatura/atividade |
| Janela restaura | 200–350 ms | Expansão e reposicionamento |
| Troca de tema | 150–260 ms | Transição de cores, sem flash |
| Notificação | 150–250 ms | Entrada discreta e saída automática |

Priorizar `transform` e `opacity`; não animar propriedades caras continuamente. Respeitar `prefers-reduced-motion`, com estado legível mesmo sem animação. Velocidades são referências para teste, não métricas aprovadas.

## 6. Home espacial: universo de produtos

**[APROVADO]** A Home ocupa a área principal com **uma bolinha por produto**, fotografias reais, fundo neutro e capa personalizada opcional. Exibir todos os clientes na mesma malha, sujeitos a filtros.

### 6.1 Layout da tela

- **Topo:** identidade compacta markethub, busca flutuante central, filtros e controles utilitários discretos.
- **Centro:** malha orgânica/hexagonal bidimensional manipulável; área dominante da interface.
- **Inferior:** Dock flutuante centralizado, com atalhos de navegação.
- **Lateral discreta [PROPOSTO]:** botões `+`, `–` e recentralizar; controles acessíveis, sem grande painel.
- **Não mostrar:** texto de boas-vindas, frase introdutória, números fictícios de marketing, cards de mostruário ou título grande genérico.

### 6.2 A bolinha

Cada produto exibe `cover_thumbnail` escolhida entre sua foto original/miniatura padrão e capa personalizada. Se indisponível, usar placeholder neutro. O estado de produção será representado por indicador de borda/pequeno ícone discreto, não por troca exagerada de cor.

- Hover: aumentar levemente, mostrar nome e cliente, preservar itens ao redor.
- Clique: expandir em **prévia funcional**, com nome, cliente, SKU, status, marketplaces, quantidade de arquivos e ações "Abrir Produto" / "Gerar Novos Materiais".
- Fechar: retornar à posição espacial anterior, sem deslocamento inesperado.
- Um clique seguido de arraste não poderá disparar abertura acidental: distinguir gesto pelo deslocamento mínimo.
- Novo produto confirmado recebe posição nova previsível, sem embaralhar as bolinhas existentes.

### 6.3 Navegação e zoom

**[APROVADO]**

| Dispositivo/gesto | Resposta |
|---|---|
| Arrastar com mouse | Move a malha em qualquer direção |
| Roda do mouse | Desloca verticalmente |
| Shift + roda | Desloca horizontalmente |
| Ctrl + roda | Controla zoom centrado no cursor |
| Touchpad | Pan nativo bidimensional e pinça quando suportado |
| Botões `+` / `–` | Aproxima/afasta |
| Recentrar | Retorna ao ponto inicial |
| Teclado | Alternativa de foco/seleção e busca |

Navegação com inércia, desaceleração natural, limites elásticos e preservação de posição/zoom por estação. Escala de zoom (referência de planejamento: ~50–220%) será confirmada no teste com monitores reais.

### 6.4 Pesquisa híbrida espacial

Pesquisa superior encontra por **nome, SKU, EAN/GTIN, cliente, marca, categoria**, e pode também localizar módulos. Lista flutuante aparece durante digitação. Ao selecionar um produto: esconder lista → navegar até sua bolinha → destacar → expandir cartão. Para distâncias grandes, transição encurtada para não obrigar espera. Para movimento reduzido, foco imediato.

Se produto estiver oculto por filtro, informar e oferecer "Revelar produto" sem apagar filtros silenciosamente. Busca sem resultado deve oferecer limpar filtros ou criar novo cadastro. Resultados e sugestões exigem feedback de carregamento e erros.

### 6.5 Filtros

- Cliente gerenciado pela Ecommerce+.
- Marketplace(s): Mercado Livre, Shopee, Amazon.
- Categoria/marca/tipo quando disponíveis.
- Estado: cadastrado, produzindo, para revisão, liberado, com pendência.
- Favoritos, recentes e intervalo de criação [PROPOSTO].
- Aplicar filtros sem reorganizar permanentemente posições no universo; ocultar/destacar temporalmente.

### 6.6 Dock

**[APROVADO]** Dock flutuante central, persistente; composição de cinco atalhos **[PROPOSTA de implementação]:** Home, Clientes/Empresas, Nova Criação (`+` laranja), Ferramentas, Configurações. Indicador de Central de Atividades próximo ao Dock, sem sobrecarregá-lo.

O Dock fica acima da área espacial e não se move com o pan/zoom. Nos workspaces, pode reduzir discretamente o tamanho para economizar espaço.

### 6.7 Launchpad das ferramentas

**[APROVADO]** A opção Ferramentas abre um **Launchpad flutuante** sobre a Home desfocada, com ícones para Imagens, Vídeos, Conteúdo, Fiscal, Biblioteca, Métricas etc. Há comando "Ver todas as ferramentas" para página dedicada. `Esc` e clique fora fecham o Launchpad sem mudar a posição da Home.

Importante: ícones **das ferramentas** ficam aqui — **não** são as bolinhas de produtos da Home.

### 6.8 Retomada da sessão

**[APROVADO]** Após login/entrada, sempre mostrar a Home espacial. Indicar discretamente atividades, edições e abas anteriores com opção "Continuar de onde parou". Não reabrir automaticamente dezenas de janelas. As preferências visuais de posição, zoom, tema e abas podem ser locais à estação; produtos e tarefas persistem globalmente no backend futuro.

### 6.9 Escalabilidade visual

**[PROPOSTO]** Renderização de miniaturas visíveis e proximidades, thumbnails otimizadas, panorama com nível de detalhes adaptativo, renderização Canvas/WebGL/PixiJS a validar, indexação de busca independente da malha, posição persistente. Testar ~30/500/3.000 produtos e medir memória, FPS, acessibilidade e latência de busca. Manter fallback em grade/lista no móvel, caso necessário.

### 6.10 Estados especiais

Catálogo vazio; sem imagens; carregando parcialmente; conexão indisponível; sem resultados; filtros sem correspondência; item arquivado; bolinha de produto recém-confirmado; produto com material pendente; erro na análise; tarefa em processamento. Cada estado terá interface sem perda de contexto.

---

# PARTE III — JORNADA 2: CRIAR E PROCESSAR

## 7. Entrada e fluxo de criação

**[APROVADO]** Começa em **janela flutuante**, não em formulário longo. O usuário cola link, envia foto, print ou documento, ou digita informações básicas. A janela cresce para **Confirmação Inteligente** depois da identificação.

### 7.1 Fluxo passo a passo

1. Usuário clica em `+` no Dock, no Launchpad ou em um produto existente.
2. Surge janela pequena com envio/URL e informações básicas.
3. Sistema cria rascunho identificável e recuperável, **ainda sem bolinha na Home**.
4. IA identifica o produto, marcando dados observados, inferidos e não identificados.
5. Janela de confirmação expande com foto, nome, categoria, marca, modelo, atributos, cliente e canais; campos editáveis.
6. **Usuário confirma identidade + cliente**; o sistema cria a ficha definitiva e **neste momento cria a bolinha na Home**.
7. Usuário revisa e personaliza o pacote (imagens, textos por marketplace, vídeo opcional e modo econômico/premium).
8. Sistema apresenta custo estimado e dependências; usuário autoriza a produção paga.
9. Job Manager registra tarefas independentes e reserva orçamento antes de submeter APIs.
10. Resultados são associados progressivamente ao produto e podem ser revisados antes do fim do pacote.
11. Materiais aprovados poderão ser liberados por canal e exportados.

**Duas autorizações distintas:** confirmar *o que é o produto* não significa confirmar *quanto gastar com IA*.

### 7.2 Origem e confiabilidade dos dados

Cada atributo identificado precisa distinguir **fonte fornecida pelo usuário**, **texto extraído de print/anúncio**, **fonte oficial verificada**, **inferência da IA** ou **campo vazio**. O modelo pode reconhecer, mas não confirmar infalivelmente marca, modelo, EAN, capacidade, dimensões ou compatibilidade apenas pela foto.

Confiabilidade pode ser apresentada como **Confirmado / Fonte identificada / Provável / Precisa conferir**. A origem exata, URL e momento de consulta devem ser armazenados quando disponíveis. Informações com baixa confiança não devem alimentar alegações técnicas ou fiscais sem revisão.

### 7.3 Importação de links

Links de Mercado Livre, Shopee, Amazon e fabricantes poderão servir como referência se a informação for acessível e o uso permitido. Nem todo link será extraível automaticamente; deve haver fallback por print, upload e cadastro manual. Não confiar em texto comercial de terceiros como prova oficial.

### 7.4 Produto semelhante

Antes de duplicar a ficha, procurar possíveis correspondências por EAN/GTIN, marca, modelo, dimensões, nome normalizado e outros identificadores. SKU pode variar entre clientes. Sugerir reaproveitamento **com autorização**, nunca fundir ou compartilhar silenciosamente informações comerciais de clientes.

## 8. Janelas inteligentes e multitarefa

**[APROVADO]** A análise ou geração nunca prende o usuário em uma única tela.

- Clique fora da janela ativa **minimiza** em vez de cancelar.
- Janela minimizada é compacta, **arrastável dentro dos limites da tela**, restaurável e exibe produto/status.
- Minimização não remove campos, anexos ou comandos.
- Abrir outra ferramenta/cliente não pausa tarefas autorizadas no backend futuro.
- Muitas miniaturas abertas podem ser agrupadas na Central de Atividades.
- Fechar interface, minimizar, fechar aba de produto e **cancelar tarefa** são ações diferentes.
- Cancelamento expresso pode exigir confirmação e pode não reverter cobrança de chamada já enviada.
- Ao concluir análise em segundo plano, status muda para "Aguardando confirmação", sem começar gerações pagas sozinho.
- Ao concluir geração, mostrar notificação discreta, sem roubar o foco da tarefa atual.

**[PROPOSTO]** Mini-janelas acopláveis às bordas, restauração ao último tamanho/posição, indicador de atividade no Dock, agrupamento automático se muitas criações simultâneas.

## 9. Pacote Inteligente Personalizável

**[APROVADO]** A IA recomenda comandos relevantes por categoria, mas o funcionário pode **adicionar, remover, editar, reordenar, selecionar quantidade e combinar comandos com instruções próprias**.

### 9.1 Perfis de produção

| Perfil | Situação | Efeito |
|---|---|---|
| Apenas cadastrar | Importar/organizar catálogo | Não gera arquivos pagos; bolinha surge após confirmar identidade + cliente |
| **Econômico — PADRÃO** | Produção diária | Reutilizar fotografias, produzir templates, poucas imagens generativas selecionadas |
| Premium | Trabalhos estratégicos | Modelos avançados e mídias mais caras mediante custo e autorização |

O modo define escolhas iniciais, **não é um bloqueio de personalização**. Mesmo em Econômico o usuário pode adicionar mais imagens; o sistema deve mostrar efeito no orçamento. A IA pode recomendar quatro/seis materiais finais, mas somente um ou dois precisam necessariamente ser geração paga se os demais puderem ser reutilizados ou compostos.

### 9.2 Meios de produção dos comandos

| Motor | Uso | Custo da operação |
|---|---|---|
| Reutilização | Foto existente e autorizada | Sem nova cobrança de geração |
| Template/renderizador | Texto, medidas, FAQ, fundos simples, redimensionamento | Processamento local/servidor |
| IA econômica | Cenário, edição e imagem que exigem geração | Custo por chamada/modelo |
| IA premium | Edição delicada, alta qualidade, cenas especiais | Custo potencialmente maior |

A escolha do motor poderá variar dentro do **mesmo comando**; por exemplo, “Benefícios” pode ser um template sobre foto existente ou arte gerada por IA. Não transformar o conjunto de mais de 80 comandos mencionado no relatório inicial em 80 chamadas automáticas.

### 9.3 Biblioteca de comandos

**[APROVADO]** Visualização **Galeria** (com miniaturas demonstrativas distintas) ou **Lista compacta**. As duas representam os mesmos comandos, favoritos, recentemente usados, recomendações para categoria, pesquisa e filtros.

Categorias indicadas no documento de origem e nas decisões posteriores:

- Capa profissional / fundo branco / capa por canal.
- Produto em uso / ambiente contextualizado / lifestyle.
- Benefícios / informativo / FAQ visual.
- Medidas / dimensional / detalhes técnicos.
- Compatibilidade / instalação / aplicação.
- Comparativo / visão explodida / close-up / macro.
- Artes promocionais, kits e variações estéticas, sempre preservando fidelidade ao produto.

**[PENDENTE]** A lista final e a ficha técnica de cada um dos “mais de 80 comandos” não foi integralmente cadastrada nem aprovada no planejamento. Não atribuir nomes adicionais como se fossem catálogo final.

### 9.4 Dados protegidos na geração

Prompt e validação devem instruir a preservar marca, rótulo, embalagem, formato, proporções, componentes, cores e características conhecidas. Não inventar compatibilidades, claims, certificações, medidas ou fotos de funcionamento que possam confundir compradores. Produto em uso pode ser simulado, mas exige revisão de fidelidade.

## 10. Conteúdo comercial por marketplace

**[APROVADO]** Produzir títulos, descrições, benefícios, palavras-chave e tags separadamente para os canais escolhidos (Mercado Livre, Shopee, Amazon). Cada versão permanece editável, copiável, regenerável individualmente e com histórico.

- Regras de caracteres, termos proibidos, atributos obrigatórios e formatos **configuráveis e verificáveis**.
- Não prometer conformidade se regras não estiverem atualizadas/verificadas.
- Gerar variações adicionais sob demanda, sem disparar dezenas de textos automaticamente.
- Separar `texto_base`/`dados_produto` das `variantes_comerciais_por_canal`.

## 11. Estúdio de Vídeos

**[APROVADO]** Vídeo é opcional e a IA sugere roteiro/stor­yboard, que o usuário pode editar antes de autorizar renderização. O Estúdio funciona também fora do fluxo de pacote.

- Cena de produto, cena de uso, benefícios, detalhes/compatibilidade, encerramento (exemplo original).
- Storyboard editável: reorganizar, remover, trocar imagens, texto e duração, solicitar regeneração de cena.
- **Vídeo Econômico:** fotos existentes, movimentos, legendas, transições e montagem por FFmpeg; cobra infraestrutura, mas não geração de clipes de IA.
- **Vídeo Generativo:** provider externo para cenas novas, com consumo por segundo/resultado e reconfirmação antes de gastos premium.
- Salvar roteiro, referências, cenas intermediárias, áudio e versões do arquivo final.
- Não representar montagem estática como demonstração autêntica de funcionamento real.

## 12. Central de Atividades e fila inteligente

**[APROVADO]** Múltiplos produtos podem estar em análise, aprovação e geração simultaneamente. O gerenciador é acessível globalmente.

### 12.1 Estados principais de tarefa

`rascunho` → `analisando` → `aguardando_confirmacao_identidade` → `identidade_confirmada` → `aguardando_confirmacao_pacote` → `na_fila` → `processando` → `concluido_parcial` / `concluido` / `erro` / `cancelado`.

Estados financeiros suplementares: `aguardando_orcamento`, `reservado`, `aguardando_recarga`, `aguardando_reconfirmacao_premium`. A exibição amigável não precisa revelar todos os nomes técnicos.

### 12.2 Prioridades

- **Urgente:** avança entre tarefas aguardando, respeitando limites e reservas.
- **Normal:** padrão, ordenação justa por chegada.
- **Baixa:** trabalho experimental/lote sem urgência.

Não interromper compulsoriamente chamadas já aceitas pelo provedor. Evitar starvation de tarefas normais por urgências recorrentes. Concorrência separada por tipo de operação/provedor [PROPOSTO].

### 12.3 Progresso e resultados

- Preferir “3 de 6 imagens prontas” a barras percentuais inventadas.
- Cada arquivo/tarefa fica disponível assim que termina, sem bloquear os demais.
- Uma falha isolada gera retry individual, preservando os arquivos anteriores.
- Mensagens de erro orientam o usuário, distinguindo erro técnico, orçamento e validação.
- Em produção, tarefas deverão sobreviver ao fechamento da janela e à saída do navegador via servidor/worker; o HTML de demonstração não oferece essa garantia real.

### 12.4 Idempotência, retry e concorrência [PROPOSTO]

Registrar identificador exclusivo da intenção de geração, idempotency key interna, provider request ID, horário, tentativas, estado e materiais produzidos. Before retry verificar se operação antiga já concluiu ou continua no provedor. Limitar retries com backoff; não repetir chamada paga automaticamente em erro ambíguo sem investigação.

### 12.5 Notificações

Notificação discreta e/ou contador no Dock ao concluir análise, gerar material, encontrar erro ou exigir confirmação de storyboard. Clicar abre tarefa/produto diretamente. Nenhuma janela em processamento deverá roubar o foco do usuário.

---
# PARTE IV — JORNADA 3: PRODUZIR, APROVAR E EXPORTAR

## 13. Workspace Adaptativo Apple Pro

**[APROVADO]** O Workspace é o ambiente individual de produção do produto, com organização **híbrida por material ou por marketplace** e layout contextual. Não é um dashboard administrativo carregado de informações.

### 13.1 Cabeçalho e navegação interna

- Cabeçalho compacto: miniatura do produto, nome, SKU, cliente, situação atual, exportar, gerar novos materiais e menu contextual.
- **Abas inteligentes por produto**: vários produtos abertos em uma área principal; se o item já existe em aba, focar a existente, sem duplicar.
- Preservar por aba: seção (imagens/vídeos/conteúdo/fiscal), filtros, edição/r​​ascunho sincronizado, seleção e zoom de visualização quando aplicável.
- Abrir novos produtos na Home/pesquisa/atividades cria ou foca aba.
- Fechar aba não apaga o produto e não cancela tarefas.
- Quando muitas abas, mostrar menu de abas abertas, busca e recentes [PROPOSTO].

### 13.2 Duas perspectivas de organização

| Visão | Prioridade | Uso típico |
|---|---|---|
| **Por Material** | Criação e edição | Todas as imagens, versões, vídeos, textos e dados fiscais do produto |
| **Por Marketplace** | Revisão e exportação | Materiais vinculados a ML, Shopee ou Amazon; status por canal |

Trocar de perspectiva **não duplica arquivos**. O banco registra associações N:N entre materiais e canais, de modo que um mesmo arquivo aprovado possa participar de múltiplos anúncios com critérios de liberação diferentes.

### 13.3 Seções funcionais

1. **Visão geral** — identidade confirmada, cliente, capa, SKU, marketplaces, resumo dos materiais, tarefas e pendências.
2. **Imagens** — originais, geradas, comandos, galeria/lista, edição, comparação, aprovação e versões.
3. **Vídeos** — roteiros, storyboards, cenas, versões e vídeos finais.
4. **Conteúdo comercial** — título, descrição, SEO e tags por canal, com edição individual.
5. **Dados técnicos/fiscais** — informações, fontes, níveis de confiabilidade e validação.
6. **Revisão** — seleção e aprovação por item/lote e avaliação de destino.
7. **Histórico** — versões, comandos, mudanças e referências de gerações.
8. **Exportação** — pacote por canal, pacote completo e relatório de exclusões.

Painel lateral de propriedades aparece **contextualmente** quando há material selecionado. A área central privilegia o formato da tarefa: fotos grandes, textos amplos, timeline ou tabela fiscal.

## 14. Editor híbrido de imagens

**[APROVADO]** Combinar comandos visuais e instruções livres em linguagem natural. Usuário pode clicar em "Alterar fundo" e complementar "preserve todos os elementos originais; iluminação natural". O trabalho gera **nova versão** e não substitui a anterior sem decisão explícita.

### 14.1 Edição contextual

- Visualização ampliada de uma imagem.
- Barra de ações: baixar, copiar, favoritar, comparar, regenerar, aprovar, marcar ajuste.
- Painel de comandos com explicação curta e exemplo visual.
- Campo de instrução livre; presets não eliminam a possibilidade de texto personalizado.
- Seleção de formato, quantidade de variações e destino da imagem.
- Preservar versão original, prompt de origem, parâmetros e modelo utilizado.

**[FUTURO/PROPOSTO]** Edição localizada por seleção/máscara em uma região da imagem; suporte real depende das APIs/modelos.

### 14.2 Comparação

**[APROVADO em conceito]** Modo lado a lado, controle deslizante antes/depois e histórico de miniaturas. A comparação precisa ter sincronização de zoom quando útil, nome da versão, data, comando e aprovação.

### 14.3 Política de versão

`original` é imutável; uma alteração cria `v2`, `v3` etc. A versão ativa escolhida por marketplace é uma **referência**, e não exclusão das demais. Ao gerar nova versão de algo aprovado, a anterior permanece aprovada; a nova entra em revisão. Favoritos e materiais descartados devem continuar distinguíveis.

## 15. Revisão, validação e aprovação

### 15.1 Dois tipos de aprovação

**[APROVADO]** Separar:

1. **Aprovação criativa da mídia**: qualidade visual, identidade do produto, textos legíveis, acabamento.
2. **Liberação por marketplace**: adequação às regras verificáveis e autorização humana para aquele canal.

Uma imagem pode estar aprovada criativamente e ainda não ter liberação Shopee/Amazon/ML. Reprovação em um canal não remove a aprovação criativa nem a autorização de uso em outro canal.

### 15.2 Estados recomendados

| Subprocesso | Estados de referência |
|---|---|
| Geração | Gerando / Gerado / Erro |
| Criação | Em revisão / Aprovado / Precisa ajuste |
| Avaliação por canal | Não avaliado / Pendente / Pronto / Necessita adaptação / Bloqueado |
| Fiscal | Confirmado / Encontrado em fonte oficial / Provável / Precisa conferir |
| Exportação | Preparando / Concluída / Falha |

### 15.3 Aprovação individual e lote

- Funcionário pode aprovar cada imagem/vídeo/texto ou vários de uma vez.
- Seleção em lote mostra prévia do efeito e solicita confirmação.
- Operação em lote não ultrapassa a etapa de validação por canal automaticamente.
- Mudanças no material aprovado criam nova versão pendente.
- Não presumir que "imagem gerada" significa "anúncio pronto".

### 15.4 Motor de validação

A validação tem camadas:

- **Verificações objetivas:** tamanho, extensão, resolução, proporção, caracteres, campos presentes, dimensões técnicas se houver fonte.
- **Análise IA assistiva:** possível incompatibilidade visual, rótulo alterado, texto técnico sem lastro, cenário inapropriado; são alertas, não certificação.
- **Decisão humana:** confirmar adequação antes de liberar para destino.

Regras de ML/Shopee/Amazon deverão ser configuráveis e versionadas com fonte e data. Não fixar limites de caracteres no backend sem conferir o tipo de anúncio/categoria e mudanças de plataforma. O histórico do usuário tem padrões internos diferentes por marketplace; tratá-los como **parâmetros de operação**, não políticas universais oficiais.

### 15.5 Correção assistida

Pendência pode oferecer "Corrigir com IA" ou "Revisar manualmente". A correção que gerar cobrança só começa após autorização financeira quando necessária e não sobrescreve material aprovado sem intervenção.

## 16. Dados técnicos e fiscais

O escopo original inclui SKU, EAN/GTIN, peso, dimensões, descrição fiscal, NCM, CEST, origem e outros dados de cadastro. Um padrão de campos útil à operação é:

| Campo | Observação |
|---|---|
| Código (SKU) | Pode variar por cliente e marketplace |
| EAN/GTIN | Não inventar; "não se aplica" apenas quando cabível e aceito no canal |
| Custo unitário | Informar somente quando recebido de fonte autorizada |
| Nome do produto para NF-e | Descrição fiscal coerente com produto real |
| Peso líquido e bruto | Fonte e unidade explícitas |
| Unidade de medida comercial | Ex.: UN, CX, KIT conforme cadastro real |
| NCM | Classificação fiscal sujeita a validação |
| CEST | Aplicabilidade depende da classificação e do contexto tributário |
| Tipo de origem / Origem | Campos distintos de acordo com sistema de destino |
| CSOSN / CST | Exigência varia pelo regime tributário e operação |
| Código de Benefício Fiscal | Aplicação e exigência específicas da UF/operação |

**Regra obrigatória:** IA não é fonte tributária definitiva. Sugerir classificação e fonte quando possível, mas separar o "confirmado" do "provável" e exigir revisão apropriada. Não presumir mesmo regime tributário para todos os clientes. Não usar defaults como origem `0` ou unidade `UN` para todas as empresas apenas por conveniência visual, sem dados autorizados do contexto.

## 17. Exportação segura e inteligente

**[APROVADO]** A exportação sugere materiais prontos, permite personalizar canais, formatos, resolução e seleção e gera **somente os materiais liberados**. Pendências não entram no pacote publicado/exportável.

### 17.1 Modalidades

- **Arquivo isolado** — download direto de imagem/vídeo/texto específico.
- **Pacote por marketplace** — mídias liberadas para canal e conteúdos daquele canal.
- **Pacote completo** — ZIP dos materiais liberados em todos os canais selecionados, com separação lógica e relatório.

### 17.2 Relatório de excluídos

Para cada item que ficou de fora, documentar: cliente, produto, SKU/identificador, canal, material/versão, motivo da exclusão, ação sugerida, data e a regra avaliada. O relatório é informativo e não equivale a certificação legal de conformidade.

### 17.3 Fluxo de exportação

Selecionar destino → carregar sugestão → mostrar inclusões/pendências → personalizar → conferir → preparar ZIP → baixar → registrar evento de exportação, opções e versões. Se nenhum material estiver liberado, não preparar ZIP vazio; mostrar pendências e botão para revisão.

### 17.4 Organização sugerida do ZIP

Estrutura conceitual (o usuário pode configurar nomes):

- `Cliente/Produto/Fotos_Originais/`
- `Cliente/Produto/Mercado_Livre/Imagens/`, `Conteudo/`, `Videos/`
- `Cliente/Produto/Shopee/Imagens/`, `Conteudo/`, `Videos/`
- `Cliente/Produto/Amazon/Imagens/`, `Conteudo/`, `Videos/`
- `Cliente/Produto/Dados_Tecnicos/`
- `Cliente/Produto/RELATORIO_DE_EXCLUSOES.md`

Evitar nomes de arquivo com dados desnecessários ou caracteres não compatíveis; manter rastreabilidade de versões no manifesto da exportação.

## 18. Critérios de conclusão do produto

**[APROVADO em conceito]** Um produto pode estar "concluído para Mercado Livre" e ainda "pendente para Shopee". O estado global resume sem ocultar a situação de cada canal. Exportado não significa publicado. A versão comercial pode continuar evoluindo depois da exportação.

---

# PARTE V — ESTRUTURA DE DADOS E ARQUITETURA FUNCIONAL

## 19. Arquitetura de um único workspace organizacional

**Estrutura lógica recomendada [PROPOSTO]:**

1. `organizacao` — registro único da Ecommerce+.
2. `cliente` — conta/empresa atendida pela Ecommerce+; pertence à organização.
3. `produto_global` — identidade técnica compartilhável quando aplicável, sem preço/custo/estoque comercial.
4. `produto_cliente` — associação entre identidade e cliente, SKU, atributos específicos e links.
5. `canal` — Mercado Livre, Shopee, Amazon etc.
6. `anuncio_destino` — cliente + produto + canal e seus textos/versionamentos.
7. `arquivo` — registro lógico de imagens, vídeos, originais e documentos.
8. `versao_material` — material gerado/editado com prompt/modelo/origem, estado e histórico.
9. `material_canal` — associação de material e canal com status de liberação.
10. `dado_produto` — atributos, unidades, fontes, confiança e revisão.
11. `comando_visual` — definições de prompts/templates, categorias, exemplos e variantes.
12. `pacote_criacao` — opções autorizadas de geração; perfis Econômico/Premium.
13. `tarefa` — estado, prioridade, reprocessamentos, idempotência e timestamps.
14. `execucao_provedor` — requisição ao fornecedor, custo, saída, latência e metadados.
15. `aprovacao` — decisão, alvo, versão/canal, referência da sessão e instante.
16. `exportacao` — manifesto, itens incluídos e excluídos, canal e arquivo resultante.
17. `orcamento_global` — teto da Ecommerce+ e competência financeira.
18. `orcamento_cliente` — limite financeiro por cliente e competência.
19. `reserva_credito` — valor reservado atomicamente a uma operação.
20. `lancamento_financeiro` — créditos, débitos, devoluções, ajustes e conciliação.
21. `regra_distribuicao` — distribuição autorizada de recargas por cliente.
22. `recarga_provedor` — evento verificado de crédito disponível, sem guardar dados sensíveis do cartão.
23. `conexao_provedor` — conexão lógica e identificador do segredo armazenado no cofre seguro.
24. `sessao_estacao` — preferências de dispositivo, abas e localização da Home, sem fingir identidade pessoal comprovada.
25. `auditoria` — eventos relevantes e alterações financeiras/editoriais.

**Observação:** o nome das tabelas/entidades é conceitual. Não representa esquema de banco implementado nem modelo obrigatório.

### 19.1 Separação entre produto técnico e cadastro do cliente

Um modelo genérico pode conter marca, modelo, especificações e EAN quando verificados. O vínculo do **cliente** contém SKU interno, mídia aprovada, canais, conteúdo e informações comerciais dele. Dessa forma, reaproveitar uma ficha técnica não revela preço, estoque, custos ou material não autorizado de outro cliente.

### 19.2 Relacionamentos essenciais

- Uma Ecommerce+ → N clientes.
- Um cliente → N produtos cadastrados.
- Uma identidade global de produto → N vínculos de clientes **quando autorizados**.
- Um produto-cliente → N versões de materiais e N canais.
- Um material → pode estar associado a N canais; cada associação tem liberação separada.
- Um pacote → N tarefas; cada tarefa → 0..N execuções de provedores/retentativas.
- Um lançamento financeiro → vinculado ao cliente, tarefa e provedor; pagamento global não deve ser contado duas vezes.

## 20. Proposta de stack técnica

| Camada | Recomendação | Justificativa |
|---|---|---|
| Frontend | Next.js + React + TypeScript | Navegação interna, componentes reutilizáveis e tipagem |
| Home espacial | PixiJS/Canvas/WebGL **ou** DOM/CSS a comparar | Escala com milhares de miniaturas; requer benchmark |
| UI e motion | CSS + biblioteca de animações compatível | Transições, fades, janelas e acessibilidade |
| API | Backend privado com autenticação e validação | Nunca expor chaves de provedores |
| Banco | PostgreSQL (Supabase como opção) | Dados relacionais, transações e histórico |
| Arquivos | Cloudflare R2 / S3 compatível | Imagens, vídeos, ZIPs, originais e thumbnails |
| Filas | Redis + BullMQ ou serviço equivalente | Concor­rência controlada, retries e prioridades |
| Workers | Serviços persistentes separados do frontend | Chamadas demoradas de imagem/vídeo e FFmpeg |
| Imagem local | Sharp/libvips, templates e SVG | Redimensionamento, composição e ajustes sem IA paga |
| Vídeo local | FFmpeg | Montage/motion/legendas/transições |
| Observabilidade | Logs estruturados, métricas e rastreio | Suporte e custo por tarefa |
| Cofre de segredos | Gerenciador de segredos do backend/KMS | API keys cifradas, rotação e acesso protegido |
| Atualização de status | SSE/WebSocket ou polling com fallback | Progresso em tempo real sem bloquear UI |

**[PENDENTE]** Essas escolhas são propostas, não contratos. O protótipo HTML não comprova capacidade de processar APIs, renderizar 3.000 produtos com qualidade ou entregar os SLAs esperados.

### 20.1 Separação frontend/backend

Frontend mostra resultados, coleta entradas, exibe custo estimado, integra estados e mantém UI responsiva. Backend valida permissões, verifica orçamento, registra reservas, chama APIs, armazena arquivos, agenda tarefas e publica eventos de status. Workers independentes processam jobs sem depender do tempo de vida da requisição web.

### 20.2 Princípio de APIs substituíveis

Não amarrar o botão "Gerar imagem" diretamente a um fornecedor. Criar operações internas: `analisar_produto`, `gerar_textos`, `gerar_imagem`, `editar_imagem`, `criar_storyboard`, `gerar_cena_video`, `montar_video`, `validar_material`, `exportar_pacote`.

AI Router escolhe o método (reutilizar, template, IA Econômica, IA Premium), verifica compatibilidade e custo, cria Job e normaliza resultados. Se o fornecedor mudar, não altera a organização do Workspace.

### 20.3 Continuidade de tarefas

A imagem mental de "janela minimizada" não é mecanismo de background em produção. A execução é **persistida no banco e na fila**, com worker retomável; a janela apenas observa o status. Se a página fechar, o servidor pode continuar tarefa já autorizada. Se worker reiniciar, a fila usa estado/idempotência para reprocessar de forma segura.

### 20.4 Arquivos e versões

Guardar originais imutáveis e derivados em bucket privado com chaves não previsíveis. Gerar thumbnails específicas da Home; URLs assinadas expiram; apagar ou substituir deve ter registro e política de retenção. ZIPs podem ser efêmeros ou gerados sob demanda; exportação registra manifesto para repetição.

---

# PARTE VI — APIS DE IA, CHAVES E SEGURANÇA

## 21. Estratégia de fornecedores e modelos

**[APROVADO]** Projetar um painel seguro para cadastrar API keys necessárias no futuro. **[PENDENTE]** Número final de provedores ativos e modelo principal por função; nenhuma conexão real aprovada/implementada.

**Recomendação atual [PROPOSTO]:** começar com texto/identificação em OpenAI e imagens econômicas em Gemini; vídeo generativo opcional por Runway ou Veo, mantendo FFmpeg para montagem local. Não é obrigatório contratar três serviços de imediato.

| Tipo de tarefa | Opção técnica a testar | Critério |
|---|---|---|
| Análise por print/foto | OpenAI GPT-6 Luna | Latência/custo/precisão de atributos |
| Análise complexa | GPT-6.1 Sol | Revisão de ambiguidades e dados contraditórios |
| Texto por marketplace | GPT-6 Luna, escalando se necessário | Qualidade SEO, fidelidade, limites de caracteres |
| Imagens econômicas | Google Gemini 3.1 Flash Lite Image | Fidelidade a produto, custo e qualidade |
| Imagens intermediárias | Google Nano Banana 2.1 / Gemini Flash Image | Qualidade visual, custo e resolução |
| Edição premium | GPT Image 2.5 Sunburst / modelo equivalente | Preservação de embalagens e detalhes |
| Vídeo econômico | FFmpeg + imagens aprovadas | Custo de máquina e acabamento |
| Vídeo generativo | Runway Gen-4 Turbo ou Veo 3.1 Lite | Custo real por segundo e qualidade |

**Nenhum modelo deverá ser fixado como "vencedor" sem testes comparativos com produtos reais da Ecommerce+ e revisão das condições contratuais e tarifárias na data de contratação.**

### 21.1 Saídas estruturadas

A identificação deverá devolver uma ficha com campos tipados, indicação de evidências e atributos faltantes. Saída estrutural previsível facilita integração, mas **não equivale à prova de veracidade**. Prompt injection em link/documento externo não poderá autorizar cobrança, executar funções privilegiadas ou alterar regras financeiras.

### 21.2 Política de fallback

Falha transitória → tentativa controlada, com limite; indisponibilidade do provedor → avaliar alternativa **sujeita a custo e orçamento**; erro de classificação → solicitar entrada/revisão. Não trocar silenciosamente para fornecedor mais caro. Se o resultado foi cobrado mas o retorno se perdeu, verificar status da requisição antes de repeti-la.

### 21.3 Batch e urgência

- Produção econômica em lote para conteúdo e imagens compatíveis sem urgência.
- Tarefas interativas quando funcionário necessita visualização rápida.
- Estimativa e autorização do tipo de processamento antes da execução.
- Batch pode levar muitas horas; não prometer entrega imediata.
- Resultados recebidos fora de ordem devem associar-se ao job/produto correto.

## 22. Painel seguro de integrações: conceito e requisitos

**[APROVADO em conceito]** Configurações → **Integrações de IA** terá cartões de fornecedores, estado de conexão, finalidade, perfil de produção, método de autenticação suportado, teste de conexão e possibilidade de rotação/revogação na versão funcional.

### 22.1 Estados da integração

- **Não configurado:** nenhuma credencial presente.
- **Configurado, não testado:** referência ao segredo existe, sem confirmação de validade.
- **Conectado:** teste de autorização válido no backend (não implica saldo financeiro disponível).
- **Sem créditos / indisponível:** credencial válida mas execução bloqueada/limitada.
- **Erro de autenticação:** chave inválida, revogada ou escopo insuficiente.
- **Desativado:** conexão desligada sem excluir histórico.

### 22.2 Regras de segurança INEGOCIÁVEIS

1. Nunca inserir API key real em HTML estático/protótipo.
2. Nunca gravar API key em `localStorage`, `sessionStorage`, variável JS publicada, URL, QR code, log de requisição ou screenshot.
3. Chaves ficam **no servidor**, em serviço de secrets/KMS com criptografia, controle de acesso e rotação.
4. Após cadastro, interface mostra apenas máscara e quatro caracteres finais quando apropriado.
5. Formulário de cadastro protegido por autenticação administrativa **separada**, apesar da conta operacional compartilhada.
6. Todas as chamadas pagas ocorrem no backend; o frontend recebe apenas ID de tarefa e status sanitizado.
7. Chaves preferencialmente com menor escopo permitido, por projeto/ambiente.
8. Teste de conexão não deve gastar créditos desnecessariamente; se custar, informar.
9. Não expor uso/saldo sensível a usuários que não precisam de privilégios financeiros.
10. Auditar alterações de provedor, troca de credencial, testes e revogações.
11. Separar chaves de **desenvolvimento, homologação e produção**.
12. Nunca interpretar confirmação de pagamento digitada pelo usuário como crédito disponível sem evidência verificável.

### 22.3 Conta compartilhada vs. administração segura

A decisão de **uma conta operacional comum** continua preservada. Entretanto, o painel de chaves e operações financeiras precisa de uma proteção diferente, para não permitir que qualquer pessoa com acesso operacional copie/rotacione credenciais ou altere regras autorizadas. Isso pode ser uma credencial administrativa separada, sessão forte ou mecanismo equivalente na implementação real — **[PROPOSTO]**, não disponível no HTML.

### 22.4 Estado atual do protótipo

O protótipo `markethub_prototipo_interativo_v2.html` já representa visualmente **Ajustes → Integrações de IA**, mas trata o cofre como **demonstração** e orienta não colar credenciais reais. Não é backend, não armazena segredos reais e não valida saldo de provedores. Não confundir uma interface desenhada com uma integração funcionando.

## 23. ChatGPT pago vs. uso de API

**[FONTE OFICIAL]** A assinatura individual do ChatGPT, inclusive planos avançados, **não inclui automaticamente créditos para a API**. As cobranças e faturamentos são separados. Não reutilizar uma sessão web pessoal como substituta de API, nem compartilhar as credenciais do ChatGPT pessoal com funcionários.

Uso legítimo da assinatura pessoal existente: pesquisar, escrever/promover prompts manualmente, experimentar imagens, avaliar qualidade e preparar referências. Automatizações internas em escala devem utilizar uma API apropriada, com orçamento próprio.

## 24. Segurança, privacidade e conformidade

- Controle de acesso ao armazenamento dos produtos e arquivos dos clientes.
- Separação lógica por cliente, mesmo sendo uma organização proprietária.
- Registro de origem de materiais e permissão de reutilização entre clientes.
- Revisão dos termos de uso dos provedores quanto a dados enviados, retenção e uso comercial.
- Política de exclusão e retenção de dados compatível com contratos dos clientes e LGPD.
- Dados fiscais sensíveis e custos comerciais não devem aparecer em busca global sem contexto de autorização.
- Logs nunca devem incluir API keys, dados de pagamento completos ou conteúdos sensíveis sem necessidade.
- Tratar imagens/documentos de entrada como dados não confiáveis quanto a instruções externas.
- Backups verificáveis e procedimento de restauração de banco, metadados e arquivos.
- Auditoria de aprovação e exportação em nível de sessão até existirem identidades individuais.

---

# PARTE VII — GOVERNANÇA FINANCEIRA E MODO ECONÔMICO

## 25. Visão financeira definitiva: Ecommerce+ e clientes atendidos

**[APROVADO]** O markethub possui **um orçamento geral da Ecommerce+** e **sublimites internos por cliente atendido**. Isso **não** cria uma assinatura, uma conta de IA ou um provedor separado para cada cliente. O objetivo é identificar consumo, distribuir capacidade de geração e impedir despesas não autorizadas.

**[APROVADO]** Qualquer funcionário que use a conta operacional compartilhada pode trabalhar com os produtos de qualquer cliente. **Pagar ou recarregar créditos**, porém, depende de autorização válida para o meio de pagamento; a plataforma não considera o simples login operacional prova de autorização financeira.

**[APROVADO]** O consumo dos provedores deve ser consolidado em um **painel financeiro único**, mantendo:

1. O orçamento global interno, em reais.
2. O orçamento interno de cada cliente, em reais.
3. O saldo ou capacidade de cobrança de cada provedor, na moeda correspondente.
4. O valor reservado para tarefas autorizadas e ainda não concluídas.
5. O valor consumido estimado e o valor efetivamente apurado/faturado.
6. Os registros de recarga, distribuição, ajustes, estornos e conciliação.

**Regra invariável:** nenhuma geração paga deve começar quando não há capacidade autorizada **simultaneamente** no orçamento global, no suborçamento do cliente e nas condições operacionais do provedor escolhido. Credenciais válidas não são sinônimo de créditos disponíveis.

### 25.1 Revisão histórica da regra de bloqueio

O usuário aprovou inicialmente o bloqueio até o próximo ciclo, **mas posteriormente o substituiu explicitamente** pelo desbloqueio e retomada **após recarga comprovadamente confirmada e atualização autorizada do orçamento interno**. Essa mudança prevalece.

- **[APROVADO]** Esgotou o saldo: bloquear **novas** operações pagas elegíveis ao orçamento esgotado.
- **[APROVADO]** Sem recarga comprovada: permanecer bloqueado até o novo ciclo ou outra disponibilização válida de orçamento previamente autorizada.
- **[APROVADO]** Recarga confirmada: distribuir automaticamente segundo regras e limites já configurados e reavaliar a fila, sem aguardar necessariamente o próximo mês.
- **[APROVADO]** Tarefas econômicas já autorizadas e ainda elegíveis podem retomar automaticamente.
- **[APROVADO]** Vídeos generativos, operações premium e trabalhos cuja estimativa de custo mudou exigem **nova confirmação humana**.
- **[APROVADO]** Não existe desbloqueio discricionário ilimitado nem ajuste manual arbitrário de tetos em razão do pagamento; tudo depende das regras financeiras já autorizadas.

## 26. Perfis de consumo e Pacote Inteligente Personalizável

### 26.1 Perfis disponíveis

| Perfil | Política inicial | Chamadas de IA pagas | Autonomia do funcionário |
|---|---|---|---|
| **Apenas cadastrar** | Salvar informações e arquivos existentes | Não necessárias por padrão | Pode programar produção futura |
| **Modo Econômico — PADRÃO** | Reutilização → template → modelo econômico quando preciso | Somente nas operações selecionadas/autorizadas | Pode trocar comandos e solicitar geração extra |
| **Premium** | Preferência por modelos e composições mais sofisticados | Com estimativa/reconfirmação | Pode escolher qualidade, cenários e vídeo opcional |

**[APROVADO]** O perfil é a sugestão de produção, **não um pacote rígido**. A IA sugere os comandos de interesse comercial; o funcionário pode adicionar, remover, ordenar, escrever instruções, definir formato e quantidade. A camada financeira informa o impacto e exige autorização antes das operações pagas.

### 26.2 Métodos possíveis para um comando

- **Reaproveitamento:** utiliza foto, arte, vídeo ou texto já disponível e autorizado, sem chamada de geração nova.
- **Template local:** Sharp/SVG/renderização convencional para recorte, dimensões, benefícios em arte, layout e infográficos feitos com dados verificados.
- **Modelo econômico interativo:** geração rápida de texto, imagem ou análise com custo baixo.
- **Modelo econômico Batch:** execução em lote, quando suportada e sem urgência; resultados podem chegar depois.
- **Modelo premium:** edição mais exigente ou cena de vídeo com custo superior e confirmação específica.

**Exemplo ilustrativo para seis imagens comerciais de um item com boas fotos:** capa reaproveitada; detalhes com foto original; benefícios, medidas e FAQ com templates; somente imagem de uso criada por IA. Produzir **seis materiais finais** não requer necessariamente seis imagens generativas.

**[PROPOSTO]** A análise econômica de material deve oferecer justificativa curta: "Foto de capa existente adequada", "Medida não verificada — arte em revisão", "Cena em uso requer geração". Não afirmar que o modelo econômico é sempre suficiente.

## 27. Contabilidade e reserva antes da execução

### 27.1 Grandezas diferentes

| Indicador | Definição | Fórmula conceitual |
|---|---|---|
| Limite global | Capacidade aprovada da Ecommerce+ no período | Configuração + recargas distribuíveis autorizadas |
| Limite do cliente | Capacidade interna do cliente | Regra de rateio, teto e competência |
| Consumido | Operações com custo apurado ou provisoriamente reconhecido | Soma das despesas reconhecidas |
| Reservado | Capacidade comprometida para trabalhos não finalizados | Soma das reservas ativas por job |
| Disponível | Capacidade para novas autorizações | Limite − consumido − reservado − margem exigida |
| Projetado | Demanda estimada ainda não autorizada | Simulação; **não** reserva automática |
| Faturado pelo provedor | Custo apresentado pelo fornecedor | Conciliação posterior; pode atrasar |

**[PROPOSTO]** Cada autorização gera `budget_reservation` com ID único, `client_id`, `provider_id`, moeda, taxa de câmbio de referência, estimativa, margem de segurança, estado, timestamps e `job_id` relacionado. Reservas devem ser **atômicas e transacionais**, impedindo dupla alocação por workers concorrentes.

### 27.2 Etapas financeiras de uma geração

1. Resolver cliente e tipo de operação.
2. Definir método/fornecedor e estimativa conservadora, incluindo entradas, saídas e refações previstas quando aplicável.
3. Verificar saldos global, cliente e provedor.
4. Reservar a capacidade necessária numa transação idempotente.
5. Persistir autorização e enfileirar a tarefa.
6. Executar sem criar requisição duplicada por duplo clique.
7. Identificar resultado e débito reportado; conciliar a reserva.
8. Liberar saldo excedente ou registrar diferença, respeitando as regras de bloqueio.
9. Registrar operação auditável sem expor credenciais ou dados sensíveis.

**[PROPOSTO]** Uma reserva **não equivale a cobrança real**. Uma chamada que falha pode ter custo, e dados reais do fornecedor podem chegar depois. Não usar uma porcentagem de progresso inventada como base para consumo. A aplicação minimiza risco de ultrapassar o teto, mas não promete impossibilidade absoluta de excedente em fornecedores externos.

### 27.3 Moeda e câmbio

- Armazenar **montante e moeda originais** da operação (`USD`, `BRL` ou outra), além do BRL gerencial convertido.
- Registrar a cotação e sua fonte/data; não recalcular retroativamente o BRL histórico com cotação do dia.
- Separar câmbio comercial estimado, impostos e tarifa de pagamento, e conciliar a fatura.
- Não contabilizar a **mesma recarga** como despesa de geração e como consumo de tokens; recarga é movimentação de crédito/caixa, consumo é uso efetivo do serviço.

## 28. Limites, alertas, bloqueios e continuidade

**[APROVADO]** Há bloqueio automático por orçamento e retomada inteligente após disponibilidade válida de saldo. O bloqueio **não** interrompe navegação, busca, edição local, templates sem IA, revisão, aprovação ou download de materiais já liberados.

| Evento | Comportamento obrigatório |
|---|---|
| Cliente A atingiu seu limite | Bloquear novas tarefas pagas de A; outros clientes podem continuar se houver saldo global/provedor |
| Orçamento global acabou | Bloquear novas tarefas pagas de todos os clientes |
| Saldo externo de um provedor acabou | Bloquear apenas trabalhos dependentes dele ou avaliar alternativa autorizada e compatível |
| Tarefa já enviada ao provedor | Pode concluir e gerar cobrança; ajustar saldos e não apagar o trabalho |
| Tarefa aguardando confirmação humana | Não iniciar geração paga sem confirmar |
| Tarefa aguardando orçamento | Preservar rascunho, prompts, itens selecionados e arquivos anteriores; não tentar em loop |
| Recarregou, mas saldo não apareceu | Manter bloqueio até evidência de disponibilidade |
| Recarregou, regra autorizou distribuição | Reservar limites e reavaliar jobs elegíveis automaticamente |
| Vídeo/premium bloqueado | Preservar o trabalho e solicitar reconfirmação após a recarga |
| Nova competência | Reaplicar o orçamento do novo ciclo; não duplicar reservas de jobs antigos |

**[PROPOSTO]** Alertas informativos ao atingir 70% e 90%, bloqueio no teto autorizado. Percentuais e margens podem ser configurados; os pontos 70/90 são **propostas**, não uma escolha expressa do usuário.

## 29. Recarga confirmada e distribuição automática

### 29.1 Fluxo aprovado

`Recarga realizada por pessoa autorizada` → `confirmação confiável do provedor` → `saldo disponível/condição de cobrança atualizada` → `identificação da recarga sem duplicidade` → `aplicação das regras internas de distribuição` → `atualização do disponível` → `reavaliação da fila` → `retomada de jobs econômicos elegíveis / reconfirmação dos demais`.

**[APROVADO]** O autor do pagamento pode ser **qualquer pessoa autorizada** a pagar na conta. O requisito não é "foi o administrador que pagou"; o requisito é que o pagamento seja legítimo e o crédito esteja confirmado, com as regras internas cumpridas.

### 29.2 Fontes de confirmação — limitações técnicas

**[PROPOSTO]** Preferir eventos de faturamento oficialmente documentados, quando existirem; depois consulta de saldo/capacidade suportada; por último reconciliação administrativa de evidências no backend. Cada provedor difere em billing pré-pago, pós-pago, faturamento, cotas, webhooks e latência de atualização.

- **Não presumir webhook de pagamento onde não estiver documentado.**
- **Não liberar apenas com upload de comprovante ou clique "Paguei".**
- **Não confundir chave válida com saldo positivo.**
- **Não tratar uma fatura pós-paga como "créditos comprados" se esse não for o modelo do provedor.**
- **Não usar scraping de painel de cobrança como fundamento exclusivo de autorização financeira.**
- **Não permitir que um evento recebido duas vezes credite orçamento duas vezes.**

### 29.3 Regras de distribuição por cliente

**[APROVADO]** Distribuição automática conforme regras e limites previamente configurados. As regras devem ser versionadas e válidas antes da recarga ser identificada.

**[PROPOSTO]** Estrutura configurável de cada regra:

- `client_id`, estado ativo/inativo e competência;
- parcela fixa ou percentual do crédito elegível (definir um modo de rateio por política);
- sub-teto máximo autorizado do cliente no período;
- prioridade de distribuição e tratamento do excedente;
- valor de reserva global não atribuído e câmbio adotado;
- fornecedor/projeto ao qual se aplica, quando necessário;
- data de vigência e histórico de versões;
- identificador do aprovador das regras financeiras.

**Exemplo hipotético:** recarga gerencial equivalente a R$ 300 → Cliente A R$ 120, B R$ 90, C R$ 60 e reserva global R$ 30, **somente** se isso coincidir com regras aprovadas e não ultrapassar os sub-tetos. Não significa que o dinheiro foi depositado nas contas bancárias dos clientes.

Se uma parcela não couber no teto do cliente, ela ficará em **reserva não distribuída** ou seguirá a regra de excedente previamente aprovada; não redistribuir arbitrariamente em favor de outro cliente.

**[PENDENTE]** As porcentagens, os valores reais de limite global e de cada cliente, e a modalidade exata de rateio ainda serão escolhidos. A decisão aprovada é **automatizar a distribuição por regras pré-configuradas**, não fixar percentuais.

### 29.4 Estados possíveis da recarga

| Estado | Significado |
|---|---|
| `payment_detected` | Há sinal de pagamento, ainda sem prova financeira suficiente |
| `pending_confirmation` | Aguardando provedor ou conciliação válida |
| `confirmed` | Crédito/condição de cobrança comprovadamente atualizado |
| `allocated` | Regra interna aplicada com sucesso, sem duplicidade |
| `partially_allocated` | Parte retida por tetos/regras, saldo restante em reserva |
| `rejected` | Pagamento inválido, duplicado, estornado ou não aplicável |
| `needs_attention` | Inconsistência entre saldo, pagamento e regra |

### 29.5 Retomada após recarga

**[APROVADO]** A retomada é automática apenas para **tarefas econômicas previamente autorizadas**, cujo custo estimado não mudou materialmente e cuja reserva cabe no saldo atualizado. Vídeos, tarefas premium e custos alterados aguardam nova aprovação.

**[PROPOSTO]** Antes da retomada, revalidar: cliente, modelo disponível, política do modo, prioridade, integridade de arquivos, quotas, disponibilidade do provedor, custo de entrada/saída, idempotência e risco de chamada já faturada.

**Regra de não surpresa:** recarregar créditos **não autoriza** todas as tarefas antigas sem filtro. A recarga cria capacidade; cada job ainda precisa ser elegível, caber no orçamento e respeitar a autorização original.

## 30. Ciclo de orçamento e competência

**[PROPOSTO]** Ciclo mensal de calendário em `America/Sao_Paulo`, iniciado no dia 1, à meia-noite local. O usuário ainda **não confirmou** dia e horário como decisão final, embora já tenha aprovado controles mensais.

- Fechamento não apaga o histórico anterior.
- Saldo não utilizado não acumula automaticamente, salvo política futura explícita.
- Recargas podem destravar o sistema antes da virada do mês, segundo as regras acima.
- Uma tarefa pode começar em um ciclo e terminar em outro; contabilização gerencial e cobrança externa precisam de critério consistente.
- Descontos, estornos e ajustes devem gerar lançamentos próprios, não editar historicamente valores sem rastreio.

## 31. Visual do painel de custos [PROPOSTO]

**Tela:** `Configurações → Financeiro / Consumo de IA` com filtros por cliente, competência, provedor e tipo de operação. Elementos:

1. Orçamento global — limite, consumido, reservado, disponível e margem de segurança.
2. Comparativo por cliente atendido — consumo, limite, fila e tendência.
3. Consumo por tipo — análise, texto, imagem econômica, imagem premium, vídeo e montagem local.
4. Provedores — capacidade de cobrança, último status verificado e divergências.
5. Recargas — comprovadas, distribuídas, parcialmente distribuídas, pendentes e estornadas.
6. Fila bloqueada — jobs preservados por razão de bloqueio e próxima condição de retomada.
7. Avisos — aproximação do teto, alterações de preço/modelo e custos não conciliados.
8. Exportação de relatórios gerenciais — não significa cobrá-los dos clientes automaticamente.

Diferenciar visualmente **valor demonstrativo**, **estimativa**, **saldo informado pelo provedor** e **valor conciliado/faturado**. Nunca mostrar um número aproximado como saldo bancário/financeiro definitivo.

---

# PARTE VIII — CUSTOS, CENÁRIOS E CRITÉRIOS DE VIABILIDADE

## 32. Regra central de economia em catálogos grandes

**[APROVADO]** O fato de a Ecommerce+ atender clientes com milhares de produtos **não implica gerar imagens para todos eles**. As quantidades que determinam o custo variável são **operações pagas efetivamente disparadas**, não o total de cadastros.

Distinguir no painel:

- `catalog_products`: cadastros existentes, inclusive importações simples;
- `products_analyzed`: produtos submetidos a análise paga;
- `products_generated_economic`: produtos com alguma geração econômica;
- `products_generated_premium`: produtos com gerações premium;
- `images_generated`: quantidade efetiva, incluindo refações;
- `videos_generated_seconds`: segundos de vídeo generativo faturáveis;
- `operations_local`: templates/FFmpeg/Sharp, cujo custo é de infraestrutura, não da API generativa;
- `reused_assets`: materiais reaproveitados sem nova geração;
- `approved_assets`: materiais aprovados;
- `exported_assets`: materiais exportados.

**Métrica principal de eficiência:** custo **por material aprovado e útil** (não custo por imagem tentada), além de taxa de refação, horas economizadas e qualidade comercial.

## 33. Fórmula conceitual do orçamento mensal

```text
CUSTO VARIÁVEL DE IA =
  análise por foto/print/link
+ texto/SEO por canal
+ imagens geradas (inclusive refações e entradas cobradas)
+ vídeo generativo (segundos/cenas/refações)
+ consultas/pesquisas externas cobradas
+ operações auxiliares de IA

CUSTO TOTAL OPERACIONAL =
  custo variável de IA
+ hospedagem, banco, filas e processamento local
+ armazenamento, operações e transferência eventualmente faturáveis
+ backups/monitoramento e outros serviços
+ tributos, spread/câmbio e taxas aplicáveis

INVESTIMENTO DE DESENVOLVIMENTO =
  horas de engenharia, design, QA e manutenção evolutiva
  (tratado SEPARADAMENTE do custo operacional)
```

Não confundir o valor da assinatura do ChatGPT com créditos de API; as plataformas possuem faturamento separado. Não há "custo máximo universal" — o máximo efetivo dependerá de um **limite configurado e aplicado**, respeitadas as ressalvas sobre cobranças externas em andamento.

## 34. Preços públicos de referência em outubro de 2026

**[FONTE OFICIAL, referência para estudo — NÃO contratação]** Conferir novamente os links no dia da implementação. Valores podem mudar por modelo, contexto, modalidade, região e impostos:

| Serviço | Referência pública encontrada | O que pode alterar o valor |
|---|---|---|
| Google Gemini 3.1 Flash Lite Image, 1K | **US$ 0,0336 por imagem de saída** padrão | Entradas cobradas; resolução, configuração e outro modelo |
| Google Gemini 3.1 Flash Lite Image, 1K Batch | **US$ 0,0168 por imagem de saída** | Entradas cobradas, tempo do lote, disponibilidade |
| Google Gemini 3.1 Flash Image, 2K | **US$ 0,101 por imagem de saída** padrão | Entradas, resolução e saída efetiva |
| Runway Gen-4 Turbo | **5 créditos/segundo**, com crédito a US$ 0,01 → **US$ 0,05/segundo** | Duração/clipes/refações/planos e tributos |
| Supabase Pro | **A partir de US$ 25/mês** | Uso de banco, saída e serviços extras |
| Cloudflare R2 Standard | **US$ 0,015/GB-mês** acima da franquia | Operações e franquia aplicável |
| Vercel | Planos comerciais sob contratação | Assentos, consumo de funções e tráfego |
| GPT de texto ou imagem | Precificação por tokens/qualidade/modelo | Cache, modalidade, contexto, ferramentas e versões |

**Fontes:**

- Google Gemini: <https://ai.google.dev/gemini-api/docs/pricing>
- OpenAI API: <https://platform.openai.com/pricing>
- Runway API: <https://docs.dev.runwayml.com/usage/billing/>
- Supabase: <https://supabase.com/pricing>
- Cloudflare R2: <https://developers.cloudflare.com/r2/pricing/>
- Vercel: <https://vercel.com/pricing>

**[PROPOSTO]** Não gravar valores de preço fixos no código. Utilizar tabela configurável de preços `provider_price_card` com modelo, região, período de vigência, fonte, qualidade/resolução e versão. Toda estimativa mostra hipóteses e sua data de validade.

### 34.1 Histórico de faixas debatidas — NÃO orçamento aprovado

Na conversa, foram citadas as seguintes **faixas exploratórias**, sem medição real de produção: uso leve **R$ 300–600/mês**, moderado **R$ 750–1.300/mês** e intenso **R$ 2.000–5.000+/mês**; foi sugerido um piloto ainda mais enxuto na ordem de **R$ 200–400/mês** em condições econômicas. Essas faixas **não podem ser interpretadas como previsão contratual confiável** e não devem ser somadas ou aplicadas por cliente, pois o produto tem **um único ambiente Ecommerce+**.

**[PENDENTE]** Orçamento efetivo, quantidade de produtos/mês, proporção premium e minutos de vídeo ainda não foram confirmados. Os preços dependem dos parâmetros técnicos e de quantas refações serão necessárias.

## 35. Cenários operacionais a modelar [PROPOSTO]

| Cenário | Volume | Princípio de produção | Indicadores para medir |
|---|---|---|---|
| Piloto | 20 produtos variados | Comparar modelos e qualidade; alguns vídeos opcionais | Custo/resultado aprovado, refações, tempo |
| Rotina leve | 100 produtos trabalhados/mês | Maioria Econômico, poucos Premium | Infraestrutura + variável por categoria |
| Rotina intermediária | 500 produtos trabalhados/mês | Reutilização/Batch em escala | Custo por cliente e custo por anúncio |
| Rotina intensa | 1.000+ produtos trabalhados/mês | Fila e governança de custos imprescindíveis | Throughput, SLA, erros, refações |

Duas perguntas futuras mudam todas as contas: **quantos produtos são efetivamente trabalhados por mês** e **qual fração recebe imagens premium ou vídeo generativo**. Não confundir "mil produtos por cliente existentes no marketplace" com "mil produtos produzidos neste mês".

### 35.1 Exemplo apenas de custo de imagens econômicas

Com 100 imagens **efetivamente geradas**, usando Google Lite 1K Batch a **US$ 0,0168 por saída**, o custo-base das **saídas** seria aproximadamente **US$ 1,68**, antes das entradas, refações, tributos e infraestrutura. Já o custo total do sistema é maior porque inclui hospedagem, análise, texto, backups e armazenamento. Este exemplo é **aritmética ilustrativa, não uma proposta de orçamento completo**.

### 35.2 Controle de refações

- Separar tentativa nova por mudança de briefing de **retry técnico** por falha do provedor.
- Ao clicar "Gerar novamente", informar se haverá nova cobrança.
- Aplicar limiares de refação por material e por produto, com opções de qualidade/fornecedor.
- Medir a taxa de aprovação na primeira tentativa por categoria e modelo.
- Preferir template local quando não houver necessidade de nova imagem generativa.
- Não permitir geração em lote sem estimativa e orçamento adequados.

## 36. Plano de testes comparativos de APIs [PROPOSTO]

**Amostra inicial sugerida:** 20 produtos de várias categorias representativas da Ecommerce+ (bicicleta, brinquedo, cosmético/limpeza, suplemento, autopeça, industrial, papelaria). Selecionar itens com características verificáveis e fotos originais adequadas.

**Desenho dos testes:**

1. Identificação por foto, print e link usando modelos de análise candidatos.
2. Títulos e descrições específicos por marketplace, com limites configurados.
3. Uma capa ou reaproveitamento, um infográfico template e uma imagem em uso por produto.
4. Repetir em dois modelos de imagem para aferir fidelidade, legibilidade, custo e taxa de refação.
5. Em poucos produtos, comparar vídeo por FFmpeg com cenas generativas.
6. Verificar tempo total por anúncio, consumo real e número de materiais aprovados.
7. Registrar causas de reprovação: rótulo alterado, geometria incorreta, texto ilegível, atributo inventado, medidas erradas, erro de categoria.
8. Só então fixar modelos principais e alternativos por tarefa.

**Critério:** comparar **custo por material aprovado e comercialmente utilizável**, não apenas valor nominal de uma chamada de API.

---

# PARTE IX — CONTRATOS FUNCIONAIS, TELAS E INTEGRAÇÕES

## 37. Contratos conceituais entre os módulos

**[PROPOSTO — ESPECIFICAÇÃO, NÃO CÓDIGO]** Cada operação interna deve ter entrada, validação, efeitos e saída previsíveis. Os campos abaixo não são endpoints públicos contratados; são contratos funcionais para orientar o futuro backend.

| Operação interna | Entradas essenciais | Resultado esperado | Condição prévia |
|---|---|---|---|
| `analisar_produto` | Print/foto/link, cliente opcional, referências | Ficha estruturada com fontes, atributos e incertezas | Arquivo/link permitido; custo autorizado quando pago |
| `confirmar_identidade` | Dados revisados, cliente, ID de rascunho | Produto definitivo + bolinha persistente | Confirmação humana de identidade e cliente |
| `montar_pacote` | Produto, canais, comandos, perfil, formatos | Proposta de materiais e preço previsto | Produto confirmado |
| `autorizar_pacote` | Pacote, custo estimado, versão de regras | Tarefas e reservas idempotentes | Limites suficientes e aceite consciente |
| `gerar_conteudo` | Produto verificado, canal, regras | Versões de título/descrição/SEO | Dados mínimos confiáveis |
| `gerar_imagem` | Fotos-base, comando, motor, formato | Nova versão de imagem e metadados | Reserva/orçamento e autorização |
| `editar_imagem` | Versão de origem, instruções/máscara | Nova versão, sem sobrescrever anterior | Direito de uso da imagem e aprovação financeira |
| `criar_storyboard` | Produto, imagens, objetivo, duração | Cenas editáveis e referências | Vídeo opcional solicitado |
| `aprovar_storyboard` | Versão e cenas | Liberação para renderização | Aceite humano |
| `gerar_video` | Storyboard aprovado, provedor/modelo | Clipes + vídeo final e custos | Reconfirmação premium quando aplicável |
| `validar_material` | Arquivo/versão, canal, regra vigente | Verificações, falhas, justificativas | Regra disponível; informar o não verificável |
| `aprovar_material` | Material, versão, canal, sessão | Aprovação com histórico | Revisão humana e versão atual |
| `exportar_pacote` | Cliente, produto, canais, seleção | Arquivos liberados + manifesto de exclusões | Materiais efetivamente liberados |
| `registrar_recarga` | Provedor, referência única, evidência | Estado financeiro da recarga | Confirmação confiável e não duplicada |
| `distribuir_recarga` | Recarga confirmada, regras vigentes | Lançamentos por cliente/reserva | Orçamento autorizado |
| `retomar_tarefas` | Jobs bloqueados, saldos, política | Jobs econômicos elegíveis na fila | Checagem de custo, idempotência e autorização |

### 37.1 Envelopes de operação

**[PROPOSTO]** Toda tarefa identificável deverá carregar, conceitualmente:

- `organization_id` (Ecommerce+), `client_id`, `product_id` ou `draft_id`;
- `job_id` e `creation_package_id` quando houver;
- `operation_type`, `profile` (`register/economic/premium`), `priority`;
- `provider_id`, `model_id`, `model_config_version` se envolver API;
- `submitted_at`, `started_at`, `updated_at`, `finished_at`;
- `status`, `retry_count`, `max_retries`, identificador de chamada externa;
- `budget_reservation_id`, moeda, estimativa e custo apurado;
- `source_asset_ids`, `result_asset_ids`, `result_version_ids`;
- `error_code` técnico sanitizado e `error_message` amigável;
- marcação sobre necessidade de reconfirmação.

A identidade do job é estável mesmo quando muda sua janela visual. Isso é necessário para minimizar e restaurar sem interromper o processamento.

## 38. Máquina de estados e eventos

### 38.1 Produto e criação

```text
rascunho
  └─> analisando
       ├─> falha_de_identificacao ─> corrigir_entrada ─> analisando
       └─> aguardando_confirmacao_identidade
             └─> identidade_confirmada + cliente_confirmado
                    └─> produto_cadastrado (bolinha na Home)
                           └─> aguardando_configuracao_pacote
                                └─> pacote_autorizado
                                     └─> producao_parcial/total
                                          └─> revisao
                                               └─> materiais_liberados_por_canal
                                                    └─> exportacao
```

A exportação não é fim irrevogável; o produto pode receber mais versões após a conclusão.

### 38.2 Tarefas de geração

```text
proposta -> aguardando_autorizacao -> na_fila -> reservada -> processando
                                                  |           |
                                                  |           +-> concluida
                                                  |           +-> concluida_parcial
                                                  |           +-> falhou (retry seguro / intervenção)
                                                  +-> aguardando_orcamento
                                                         -> recarga_confirmada
                                                         -> revalidar_elegibilidade
                                                         -> na_fila / reconfirmacao
```

**[PROPOSTO]** Não tratar "na fila" como custo consumido nem "processando" como garantia de cobrança final. Não criar uma nova tarefa se já existe intenção idempotente igual e ativa. O estado `cancelado` significa cancelamento interno; chamadas aceitas pelo provedor poderão ter condições próprias e eventualmente gerar custos.

### 38.3 Eventos de interface

| Evento | Interface afetada | Resposta UX |
|---|---|---|
| `product.confirmed` | Home / busca / Workspace | Incluir bolinha sem reordenar a malha inteira |
| `job.started` | Central de Atividades | Status de execução sem bloquear tela |
| `asset.created` | Workspace | Exibir resultado parcial sem esperar o pacote inteiro |
| `storyboard.ready` | Vídeos / notificações | Pedir revisão humana |
| `job.needs_confirmation` | Mini-janela / atividades | Reabrir configuração, sem gasto automático |
| `job.budget_blocked` | Atividades / Financeiro | Mostrar bloqueio, saldo e o que permanece disponível |
| `recharge.confirmed` | Financeiro | Conferir distribuição, não autorizar gasto por si só |
| `recharge.allocated` | Financeiro / Job Manager | Reavaliar fila e reconfirmações |
| `asset.approved` | Workspace | Atualizar aprovação da versão específica |
| `channel.validation_changed` | Visão por canal | Recalcular elegibilidade de exportação |
| `export.ready` | Produto / atividades | Apresentar ZIP e relatório de excluídos |

## 39. Especificação das principais telas e estados

### 39.1 Home Espacial

- **Objetivo:** localizar e acessar produtos de todos os clientes; não promover o produto nem exibir dashboard de marketing.
- **Layout:** fundo escuro com gradiente laranja, bolinhas centrais, pesquisa flutuante superior, Dock inferior.
- **Entradas:** arraste, wheel, Shift+wheel, Ctrl+wheel, touchpad, clique, teclado, filtros e busca.
- **Saída:** cartão expandido e Workspace em aba.
- **Estados:** vazio, carregando, pronto, filtrado, sem resultados, link indisponível, falha, reduzido movimento.
- **Persistência local:** posição/zoom/preferência de filtros por estação; **persistência global** para cadastros reais.
- **Acessibilidade:** navegação alternativa em lista/grade e busca sem depender do movimento espacial.

### 39.2 Pesquisa Universal

- **Entradas:** produto, nome, SKU, EAN quando disponível, cliente, categoria, ferramenta e atalhos.
- **Saída para produto:** fechar lista → centralizar bolinha → expandir cartão; se objeto filtrado, informar e permitir revelá-lo.
- **Saída para ferramenta:** abrir Launchpad ou ferramenta independente adequada.
- **Estados:** digitando, carregando, poucos/muitos resultados, sem resultados, erro de indexação.
- **Atalhos sugeridos:** `Ctrl+K` busca, `Esc` fecha camada, `Enter` seleciona.

### 39.3 Nova Criação Flutuante

- **Entradas:** arquivos, print, URL, texto; múltiplas fotos do mesmo produto.
- **Acionamento:** `+` no Dock e atalhos disponíveis.
- **Minimização aprovada:** clique fora minimiza sem perder configurações; mini-janela arrastável; múltiplas minimizadas agrupáveis.
- **Estados:** vazio, importando, analisando, falha, aguardando identificação, identidade confirmada, pacote, produzindo, concluído.
- **Regra:** finalizar/fechar janela é distinto de cancelar tarefa; retomar não deve reenviar uma cobrança automaticamente.

### 39.4 Confirmação Inteligente

- **Dados:** foto, cliente, identidade, marca/modelo, características e dados incertos.
- **Validação:** campos indispensáveis; associação correta a cliente; estado de confiança por atributo.
- **Resultado ao confirmar identidade:** ficha de produto e bolinha na Home.
- **Depois:** seleção de canais e pacote, com orçamento próprio para geração.

### 39.5 Pacote Inteligente Personalizável

- **Componentes:** perfil de produção, canais, comandos (Galeria/Lista), seleção, duração/formato vídeo, estimativa de gastos e prioridade.
- **Recomendação:** IA sugere trabalhos apropriados sem impor todos os comandos.
- **Execução:** composições e templates locais quando possível, chamadas pagas apenas com autorização.
- **Estados:** recomendação, alterado, inválido, sem orçamento, aguardando autorização, autorizado, na fila.

### 39.6 Central de Atividades

- **Layout:** painel compacto global com tarefas, filtros, status, progresso real, prioridade e acesso ao contexto.
- **Funções:** restaurar mini-janela, cancelar quando suportado, refazer isoladamente, consultar motivo de bloqueio e revisar storyboard.
- **Regra:** nunca roubar o foco da interface ao concluir uma tarefa; notificação discreta.

### 39.7 Workspace Adaptativo

- **Navegação:** abas de produtos, sem abrir duplicatas; perspectivas Por Material / Por Marketplace.
- **Persistência:** aba de produto e seção recente restauráveis.
- **Ferramentas:** galeria, editores contextuais, vídeos/storyboard, fiscal, revisão, histórico e exportação.
- **Estados:** arquivo gerando, gerado, edição nova, aprovado, pendência, erro, bloqueado pelo orçamento.

### 39.8 Editor Híbrido e comparação

- **Edição:** comando visual + instrução em linguagem natural.
- **Saída:** **nova versão**, preservando versões antigas.
- **Comparador:** lado a lado, deslizador e histórico de miniaturas.
- **Proteção:** rótulo, embalagem, forma, cor e dimensões devem ser preservados ou explicitamente conferidos.

### 39.9 Revisão e validação por marketplace

- **Dois eixos:** qualidade criativa do material + aptidão para o canal selecionado.
- **Regra:** aprovação humana; verificação automática só para requisitos observáveis.
- **Ação:** selecionar e aprovar materiais individualmente ou em lote, sem aprovar requisitos fiscais não verificados.

### 39.10 Exportação Segura

- **Entrada:** produto, canais, seleções de arquivos, versões e formatos.
- **Política:** exportar **somente liberados**; apresentar excluídos, motivos e recomendações.
- **Saída:** ZIP ou arquivo individual e relatório de exclusões; registrar manifesto e versão.
- **Se pacote vazio:** não criar ZIP vazio; encaminhar para revisão.

### 39.11 Configurações → Integrações de IA

- **Protótipo:** cartões ilustrativos e campos de segredo desativados; nenhuma chave real.
- **Produção:** administração protegida, cofre no servidor, teste de conexão, rotação/revogação, status e auditoria.
- **Somente backend:** todas as chamadas cobradas e reconciliações financeiras.

### 39.12 Configurações → Financeiro

- **Painel único da Ecommerce+:** visão geral com separação gerencial por cliente.
- **Dados:** limites, reservas, consumo, conciliação, créditos de provedor, recargas e distribuição automática.
- **Operações bloqueadas:** indicar motivo específico (cliente, global, provedor, reconfirmação).
- **Segurança:** regras de distribuição e secrets têm proteção administrativa separada.

## 40. Esquema conceitual de dados e regras de integridade

**[PROPOSTO]** Além das entidades da Parte V, definir estas garantias:

- `client_id` obrigatório em todo produto de cliente, material destinado a cliente e custo de geração; exceções globais devem ser explícitas e autorizadas.
- Chave única lógica para o par `(client_id, sku)` somente se a política de SKUs do cliente e canal permitir; múltiplos canais podem compartilhar mesmo item.
- `product_identity` não contém custo, preço, desconto, estoque comercial ou segredos de outro cliente.
- `asset_version` é imutável após conclusão; nova edição cria novo registro.
- `asset_channel_release` referencia uma versão exata e um marketplace exato.
- `approval` referencia versão, escopo e contexto de revisão; não usar aprovação geral para contornar pendência específica.
- `budget_reservation` é exclusiva e associada a uma intenção de cobrança idempotente.
- `payment_event` usa chave de unicidade `(provider, provider_event_id)` ou equivalente; duplicata não realoca recursos.
- `allocation_rule_version` identifica a política aplicada na data da recarga.
- `recharge_allocation` produz lançamentos equilibrados (origem, parcelas e eventual reserva não distribuída).
- `export_manifest` preserva IDs de versões incluídas/excluídas e regras utilizadas.
- `connection_secret_ref` nunca guarda segredo em texto plano na tabela de exibição.

### 40.1 Rastreabilidade de conteúdo

Todo texto e imagem deve, quando viável, guardar:

1. Fonte original e direito de uso declarado.
2. Produto e cliente beneficiados.
3. Modelo de IA e sua versão, se houve geração.
4. Comando/instrução e configurações essenciais.
5. Versão-pai utilizada como referência.
6. Data e contexto de aprovação humana.
7. Canais para os quais foi liberado.
8. Histórico de exportações de cada versão.

Isso permite auditar a correção de dados falsos, rastrear uma arte aprovada e evitar misturas de clientes.

---

# PARTE X — SEGURANÇA, RESILIÊNCIA E OPERAÇÃO

## 41. Ameaças e mitigações principais

| Risco | Consequência | Controle proposto |
|---|---|---|
| API key exposta no frontend | Uso fraudulento e despesa | Cofre no backend, nunca enviá-la ao navegador |
| Login operacional compartilhado | Falta de atribuição individual | Sessões independentes para UX e autenticação administrativa forte para ações sensíveis |
| Vazamento entre clientes | Confidencialidade comercial comprometida | Separação lógica por `client_id`, autorização de reutilização, testes de autorização |
| Pagamento declarado mas não confirmado | Desbloqueio indevido | Evidência verificável no provedor + regra de alocação |
| Recarga processada duas vezes | Orçamento artificial inflado | Idempotência por evento financeiro |
| Operações simultâneas excedem orçamento | Despesa não autorizada | Reservas atômicas, limite global + cliente + provedor |
| Retentativa duplicada em API paga | Cobrança repetida | ID de requisição, consulta de estado e política restritiva de retries |
| Worker cai durante geração | Perda ou repetição de trabalho | Fila persistente, reprocessamento seguro, reconciliação |
| Link/print contém instrução maliciosa | Ação inesperada pela IA | Tratar entrada como dados não confiáveis; autorização separada para ações |
| Imagem IA inventa rótulo/medida | Anúncio incorreto | Originais imutáveis, revisão e validação por material |
| Informações fiscais sugeridas como certas | Cadastro fiscal indevido | Fonte, nível de validação e revisão humana |
| Dois funcionários editam ao mesmo tempo | Sobrescrita silenciosa | Controle otimista de versão e aviso de conflito |
| Volume grande de bolinhas | Lentidão/queda da Home | Virtualização, miniaturas, testes com milhares de registros |
| Link de exportação exposto | Acesso indevido a mídia | URL assinada e expiração, bucket privado, limitação de acesso |
| Vazamento de documentos de cliente ao provedor | Risco de privacidade e contrato | Política de dados, minimização, escolha consciente de provedor e termos |

### 41.1 Princípios de autenticação

- Operação diária pode continuar com **uma conta compartilhada**, como definido para a fase inicial.
- Ações de alto risco (alterar chaves, meios de pagamento, regras de distribuição, exclusão irreversível, migração) precisam de **proteção administrativa adicional**.
- Não armazenar senhas e segredos em arquivos Markdown de projeto.
- Cookies seguros, proteção contra CSRF quando aplicável, sessões com expiração, rate limiting e logs sanitizados na implementação real.
- Atribuir autoria pessoal de ações será limitado enquanto não houver credenciais individuais.

## 42. Observabilidade e recuperação

**[PROPOSTO]** Monitorar, separadamente:

- Requisições recebidas, aceitas, enfileiradas, processando, concluídas e falhas.
- Fila por provedor/modelo, tempo médio/percentis, concorrência, limite de taxa e retries.
- Custo estimado, reservado, apurado e divergente.
- Eventos de recarga/retomada e alterações de alocação.
- Tamanho de arquivos originais/miniaturas/vídeos e armazenamento por cliente.
- Latência de pesquisa, erros de UI, FPS/memória da Home espacial, taxa de falhas em dispositivos.
- Sucesso de exportação e tempo para preparar ZIP.
- Incidentes de indisponibilidade e reconciliação de operações já faturadas.

### 42.1 Política mínima de backup [PROPOSTO]

- Backup periódico de metadados, dados, regras e auditoria.
- Estratégia separada para arquivos do R2/S3 e confirmação de existência/integridade.
- Retenção e restauração testadas em ambiente isolado.
- Possibilidade de reconstruir o catálogo a partir de registros sem expor API keys.
- Exportar documentos mestres e changelog regularmente após decisões relevantes.

### 42.2 Tratamento de indisponibilidade

- Se a IA cair: manter pesquisa, catálogo, edição local de conteúdos existentes e histórico funcionando.
- Se o banco falhar: avisar claramente e evitar indicar que alterações foram salvas.
- Se o armazenamento falhar: preservar referências e estados sem gerar downloads vazios.
- Se um provedor de vídeo estiver indisponível: oferecer montagem econômica local quando fizer sentido e for autorizada.
- Se custo/limite não puder ser verificado com segurança: **falhar fechado** para novas chamadas pagas, sem bloquear tarefas gratuitas.

## 43. Política de dados, privacidade e uso de mídia

- Confirmar se fotos e vídeos enviados pelo cliente podem ser processados em serviços de terceiros e reutilizados para o cliente específico.
- Diferenciar material do cliente de licença de fabricante, banco de imagens e IA generativa.
- Evitar coleta desnecessária de dados pessoais que apareçam em prints, documentos e imagens.
- Prever exportação/exclusão de dados conforme contratos e exigências aplicáveis.
- Registrar consentimentos/autorizações comerciais de reutilização entre clientes quando necessários.
- Não transportar automaticamente informações confidenciais de precificação/estoque para prompts de imagem ou modelos sem necessidade.
- Validar conteúdo regulado (suplementos, cosméticos, produtos infantis, automotivos, dados fiscais) com regras e fontes apropriadas.

**[PENDENTE]** Documento específico de LGPD, matriz de retenção e termos de clientes deverão ser preparados quando o sistema deixar de ser somente demonstrativo.

---

# PARTE XI — TESTES, CRITÉRIOS DE ACEITAÇÃO E ROADMAP

## 44. Matriz de verificação do protótipo visual

Esta matriz descreve **o que o protótipo deve demonstrar**, não o que já está plenamente implementado. O HTML v2 existe e é uma demonstração local, mas não integra APIs nem fornece persistência de backend.

| Área | Cenário | Esperado na demonstração | Etapa funcional real |
|---|---|---|---|
| Branding | Abrir Home | Nome `markethub`, dark default, gradiente laranja, sem introdução | Temas persistentes por estação |
| Home | Arrastar e usar zoom | Deslocamento 2D e controle por mouse/atalho | Performance com milhares de thumbnails |
| Bolinha | Clicar produto | Expansão animada para cartão | Produto real e histórico |
| Busca | Pesquisar SKU | Lista de resultados e foco na bolinha | Índice persistente no banco |
| Dock | Abrir Ferramentas | Launchpad flutuante e versão completa | Integração ao Workspace real |
| Criação | Inserir print/link | Percorrer análise e confirmação simuladas | OCR/visão, extração e validação efetivas |
| Janela | Clicar fora durante análise | Minimizar sem descartar informações | Job backend independente |
| Criação | Confirmar identidade+cliente | Criar bolinha e produto de demonstração | Transação de cadastro e validação |
| Pacote | Personalizar comandos | Selecionar, editar e prever recursos | Preço real, providers, arquivos |
| Atividades | Iniciar múltiplos trabalhos | Fila e status demonstrativos | Workers, concorrência e reservas |
| Workspace | Abrir vários produtos | Abas inteligentes, visão por material/canal | Salvamento e conflito controlado |
| Editor | Criar versão | Simular/representar edição e histórico | Arquivos gerados por API e versões imutáveis |
| Vídeo | Editar storyboard | Cenas ajustáveis e aceite | Renderização e custos reais |
| Revisão | Aprovar em lote | Status mudam visualmente | Persistência e auditoria |
| Exportação | Exportar com pendências | Apenas liberados + relatório dos excluídos | ZIP real e manifesto |
| API keys | Abrir Integrações | Campos demonstrativos sem solicitar segredo real | KMS, autenticação admin, teste de conexão |
| Financeiro | Simular saldo esgotado | Bloqueio de demonstração | Ledger transacional e provedor |
| Recarga | Demonstrar retomada | Estados e regras exibidos, sem cobrança | Confirmação confiável + alocação idempotente |
| Responsivo | Desktop/tablet/móvel | Interface utilizável e legível | Teste em dispositivos físicos |
| Acessibilidade | Movimento reduzido | Alternativa sem grandes movimentos | Navegação teclado/leitor de tela |

### 44.1 Critérios não funcionais [PROPOSTO]

- UI permanece responsiva durante tarefa longa simulada ou real.
- Nenhuma operação deve exibir estado de sucesso antes da confirmação efetiva no backend.
- Busca e telas internas não precisam aguardar todos os thumbnails.
- A Home deve ser avaliada em 30, 500 e 3.000 produtos, em dispositivos reais, com medição de memória e fluidez.
- Botões de cancelar, fechar, minimizar, excluir e aprovar têm significados consistentes.
- Uma tela de erro inclui ação concreta (refazer, corrigir, reenviar, consultar status, contatar responsável).
- Operações financeiras não dependem apenas de animação ou estado em `localStorage`.

## 45. Plano de evolução recomendado

### Fase A — Refinamento do protótipo existente [PRIORIDADE ATUAL]

- Revisar a Home com equipe interna: bolinhas, gradiente, densidade, animações e busca.
- Refinar o design system para dark/light, cartões, tipografia, Dock, Launchpad, diálogos e efeitos de profundidade.
- Ajustar simulações de criação, fila, resultados progressivos e Workspace conforme feedback.
- Consolidar navegação acessível e responsiva, sem API keys reais.
- Registrar somente decisões aprovadas; preservar backups e versões.

**Entregável:** protótipo funcional de navegação, com simulações claras e sem custos de APIs.

### Fase B — Fundamentação técnica mínima [PROPOSTO]

- Definir modelo lógico inicial de dados para Ecommerce+ → clientes → produtos → materiais.
- Implementar autenticação operacional e uma fronteira administrativa forte.
- Armazenamento privado de arquivos e miniaturas reais.
- Produtos e janelas com persistência compartilhada em backend.
- Central de Atividades com jobs persistentes e capacidade de recuperação.
- Controle financeiro mínimo antes de chamadas pagas.

**Entregável:** base técnica segura sem exigir todas as integrações de IA ao mesmo tempo.

### Fase C — IA de texto e identificação [PROPOSTO]

- Comparar modelos econômicos.
- Importar foto/print/link, identificar e solicitar confirmação.
- Criar bolinha somente depois de identidade + cliente confirmados.
- Gerar títulos e descrições por marketplace, com regras editáveis.
- Medir latência, confiabilidade, erros e custos.

### Fase D — Estúdio de Imagens híbrido [PROPOSTO]

- Implementar templates/reaproveitamento antes de modelos pagos.
- Testar modelos em amostra de produtos reais e registrar refações.
- Implementar galeria e lista com comandos reais, novos arquivos e versões.
- Integrar aprovação individual e em lote e validação assistida.

### Fase E — Financeiro/recargas/filas em produção [PROPOSTO]

- Implementar limites globais e por cliente, reservas atômicas e conciliação.
- Implementar bloqueios e estados `aguardando_orcamento`.
- Integrar capacidades realmente suportadas de confirmação financeira por provedor.
- Executar distribuição automática por regras autorizadas e reconfirmação premium.
- Testar cenário de múltiplos funcionários gerando ao mesmo tempo.

**Observação:** se a IA paga for habilitada antes de terminar esta fase, pelo menos a camada **mínima de orçamento e autorização** deve existir primeiro.

### Fase F — Vídeos e exportações [PROPOSTO]

- Vídeo econômico com FFmpeg.
- Storyboard completo e edição de cenas.
- Integração opcional com provedor de vídeo generativo.
- Validação e liberação por canal; ZIP e relatório de exclusões.

### Fase G — Otimização de operação e integrações [FUTURO]

- Benchmark com milhares de produtos.
- Importações por planilha e enriquecimento progressivo do catálogo.
- Métricas por cliente e relatórios mensais de custo/produtividade.
- Integrações oficiais de Mercado Livre/Shopee/Amazon para publicação, quando aprovadas.
- Usuários individuais e permissões mais sofisticadas, se houver necessidade.

## 46. Cenários ponta a ponta de teste

### 46.1 Novo produto com zero saldo

1. Funcionário adiciona print do produto.
2. Se a identificação depender de API paga, informar bloqueio; permitir preservar entrada e cadastrar manualmente.
3. Após confirmação manual de identidade e cliente, criar bolinha.
4. Usuário escolhe pacote; itens locais são executáveis, pagos ficam aguardando orçamento.
5. Recarga confirmada é distribuída por regra; tarefas econômicas já autorizadas são reavaliadas.
6. Vídeo e Premium aguardam reconfirmação.
7. Produtos/arquivos existentes continuam acessíveis o tempo todo.

### 46.2 Dois funcionários e mesmo produto

1. Sessão X edita título; sessão Y edita imagem.
2. Cada material possui versão distinta; edições independentes podem coexistir.
3. Se ambos editarem o **mesmo campo ou versão**, o sistema identifica conflito e oferece conciliação; não sobrescrever silenciosamente.
4. Sessões podem ser identificadas como dispositivos, sem declarar autoria pessoal confiável.

### 46.3 Empresa/cliente A sem saldo, B com saldo

1. Tarefas de A entram em `aguardando_orcamento`.
2. B continua produzindo quando houver saldo global e do provedor.
3. Recarga é registrada; regras autorizadas distribuem capacidade.
4. Apenas jobs elegíveis e comportados nos limites são retomados.

### 46.4 Reuso do mesmo produto em dois clientes

1. Detectar semelhança por EAN/modelo/características, não apenas SKU.
2. Sugerir dados técnicos e arquivos reaproveitáveis.
3. Conferir autorização de uso e restrições comerciais.
4. Criar um cadastro de cliente independente, com conteúdos próprios por canal.
5. Não compartilhar preços/estoque/custos entre clientes.

### 46.5 Exportação parcial segura

1. Seis imagens geradas; quatro aprovadas e liberadas para Shopee.
2. Duas apresentam medida/compatibilidade não verificadas.
3. Exportação seleciona somente as quatro versões liberadas e textos válidos.
4. ZIP contém relatório com as duas imagens excluídas, motivo, regra e ação sugerida.
5. Histórico registra versões e data da exportação.

### 46.6 Fechar navegador durante vídeo generativo

1. Job autorizado e enviado fica registrado no servidor.
2. O navegador é fechado; a tarefa não depende da janela visual.
3. Worker busca estado no provedor e salva o resultado quando disponível.
4. Usuário abre novamente o markethub: Home espacial aparece, com opção de retomar trabalho.
5. Se o custo/status da chamada estiver ambíguo, não duplicar a solicitação paga automaticamente.

### 46.7 Filtro da Home e busca de produto oculto

1. Usuário filtra cliente A.
2. Busca encontra produto do cliente B.
3. Sistema avisa sobre o filtro e oferece revelar o produto.
4. Com a ação autorizada, foca a bolinha, anima a expansão e preserva a posição anterior para retorno.

## 47. Indicadores de sucesso do produto

**[PROPOSTO]** Medir desde o piloto:

- Produtos cadastrados e produtos trabalhados por mês.
- Materiais gerados e materiais aprovados, por tipo.
- Taxa de aprovação na primeira tentativa.
- Gerações refeitas por produto, categoria e fornecedor.
- Custo de API por material aprovado e por cliente.
- Horas estimadas economizadas, com método explícito de estimativa.
- Tempo desde cadastro até primeiro material aprovado.
- Tempo até anúncio pronto por marketplace.
- Taxa de falha de tarefas e retentativas.
- Volume de arquivos reutilizados em lugar de nova geração.
- Número de bloqueios de orçamento e tarefas recuperadas após recarga.
- Experiência de uso da Home (tarefas encontradas, tempo de busca, navegação sem erros).

Não inventar receita incremental, lucro, impacto em vendas ou economia de horas sem baseline e medição real.

---

# PARTE XII — PENDÊNCIAS, DECISÕES E REFERÊNCIAS

## 48. Lista explícita do que ainda **não está aprovado**

1. **Nome de fornecedores/modelos principais:** candidatos foram pesquisados, mas não contratados ou fechados em definitivo.
2. **Número de provedores ativos:** um, dois ou mais — decisão pendente.
3. **Stack final e hospedagem:** Next.js, PostgreSQL, R2, Redis/BullMQ e workers são propostas, não contratos.
4. **Valores financeiros reais:** orçamento global e tetos de clientes não foram definidos.
5. **Percentuais de distribuição das recargas:** regras automáticas aprovadas, valores efetivos pendentes.
6. **Dia exato de virada de competência:** dia 1/horário São Paulo é proposta a confirmar.
7. **Volumes mensais de produção:** ainda não há estimativa validada por número de clientes, categorias e mídias.
8. **Preço final de API por operação:** depende de modelo, qualidade, entradas, tokens, vídeo, câmbio e impostos.
9. **Catálogo completo dos 80+ comandos:** organização aprovada, fichas individuais pendentes.
10. **Regras de publicação e integrações oficiais:** fora do MVP; somente exportação aprovada agora.
11. **Identidade visual em nível de pixel:** conceito aprovado, testes de fontes, componentes e responsividade pendentes.
12. **Autenticação administrativa concreta:** requisito de segurança definido, mecanismo técnico por escolher.
13. **Política de armazenamento/retenção e contratos com clientes:** pendentes.
14. **Padrão técnico das exportações por marketplace:** depende das regras verificadas e configurações reais.
15. **Teste de desempenho e dispositivos:** necessário antes de declarar solução escalável.

## 49. Checklist das decisões principais já aprovadas

- [x] Sistema interno, de propriedade exclusiva da Ecommerce+.
- [x] Clientes atendidos agrupados por cliente/produto; não SaaS multi-tenant por cliente.
- [x] Conta operacional compartilhada na primeira versão.
- [x] Marca **markethub**, modo escuro padrão e gradiente laranja.
- [x] Home sem marketing introdutório ou mostra de funcionalidades.
- [x] Bolinhas representam **produtos**; cada produto tem fotografia; capa neutra padrão/personalização opcional.
- [x] Todos os produtos na mesma Home, com filtros por cliente e outros atributos.
- [x] Pesquisa flutuante híbrida e deslocamento até a bolinha encontrada.
- [x] Expansão animada da bolinha em cartão e Workspace.
- [x] Dock inferior com ferramentas/Launchpad flutuante e página completa.
- [x] Arraste livre, wheel para pan, Ctrl+wheel para zoom, touchpad e controles visuais.
- [x] Tema claro opcional; animações fade-in/fade-out e movimento reduzido.
- [x] Ao entrar, mostrar Home e oferecer retomada inteligente sem abrir janelas automaticamente.
- [x] Nova criação começa em janela flutuante, expansível após identificação.
- [x] Clique fora minimiza, janela compacta arrastável; minimizar não cancela.
- [x] Cadastro do produto/bolinha depois de confirmar identidade **e cliente**.
- [x] Gerar somente após autorização separada do pacote.
- [x] Modo Econômico como padrão; Apenas Cadastrar e Premium disponíveis.
- [x] Pacote Inteligente Personalizável, comandos em Galeria e Lista.
- [x] Edição por comando + linguagem natural; versões antigas preservadas.
- [x] Conteúdo por Mercado Livre, Shopee e Amazon.
- [x] Vídeo opcional com storyboard inteligente editável e aprovação antes da renderização.
- [x] Múltiplas criações e fila inteligente com concorrência/prioridades.
- [x] Resultados progressivos e salvamento automático com recuperação.
- [x] Workspace adaptativo com **abas inteligentes** e organização por material/canal.
- [x] Reutilização entre clientes apenas após autorização.
- [x] Revisão e aprovação individual/em lote.
- [x] Validação técnica e assistência de IA com confirmação humana.
- [x] Exportação inteligente personalizada com **somente arquivos liberados** e relatório de excluídos.
- [x] Publicação automática nos marketplaces somente em fase futura.
- [x] Um orçamento geral da Ecommerce+ e limites internos por cliente.
- [x] Bloqueio de novas tarefas pagas sem saldo.
- [x] **Recarga confirmada destrava antes do mês seguinte**, conforme orçamento interno autorizado.
- [x] Distribuição automática por regras e limites preexistentes.
- [x] Retomada inteligente de tarefas econômicas autorizadas, com reconfirmação premium/vídeo/custos alterados.
- [x] API keys futuras em painel **seguro** de backend, nunca salvas em HTML estático.
- [x] Prioridade atual: evoluir e validar protótipo antes de contratar toda a arquitetura de IA.

## 50. Referências internas e versões existentes

- **Documento inicial:** `ia.md` — visão de uma Central de IA para operações de marketplace.
- **Backup anterior 1:** `Central_IA_Marketplaces_Planejamento_Consolidado_v1.md`.
- **Backup anterior 2:** `Central_IA_Marketplaces_Planejamento_Consolidado_v2.md`.
- **Primeiro protótipo:** `Central_IA_Prototipo_Interativo_v1.html`.
- **Protótipo mais recente no contexto:** `markethub_prototipo_interativo_v2.html`.
- **Este documento mestre:** `markethub_DOCUMENTO_MESTRE_COMPLETO_v3.md`.

A existência desses arquivos e do HTML **não comprova integração real** com IA, cobrança, jobs de servidor ou exportações persistentes. O protótipo é uma ferramenta de revisão de UX com fluxos simulados e dados locais de demonstração; jamais inserir API keys nele.

### 50.1 Fontes técnicas públicas para consulta futura

As fontes abaixo foram consultadas durante o planejamento e **precisam ser revistas novamente na contratação**:

- OpenAI — modelos e preços: <https://platform.openai.com/pricing>
- OpenAI — documentação de modelos e integrações: <https://developers.openai.com/api/docs/models>
- OpenAI — faturamento ChatGPT separado da API: <https://help.openai.com/en/articles/9039756-managing-billing-settings-on-chatgpt-web-and-platform>
- Google Gemini — preços: <https://ai.google.dev/gemini-api/docs/pricing>
- Google Gemini — modelos de imagem: <https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-image.md>
- Runway — cobrança por créditos: <https://docs.dev.runwayml.com/usage/billing/>
- Supabase — planos: <https://supabase.com/pricing>
- Cloudflare R2 — preços: <https://developers.cloudflare.com/r2/pricing/>
- Vercel — planos e regras: <https://vercel.com/pricing> e <https://vercel.com/docs/plans/hobby>

**[ATENÇÃO]** Sites, termos de uso, limites e preços podem mudar. Não usar números deste documento como proposta comercial sem atualizar as fontes e registrar a data da cotação.

## 51. Convenções de alteração e preservação do projeto

Para futuras iterações, registrar um changelog resumindo:

| Campo | O que registrar |
|---|---|
| Versão | Ex.: v3.1, v4.0 |
| Data | Data da alteração |
| Origem | Nova decisão do usuário, correção técnica ou teste de UX |
| Módulos afetados | Home, Workspace, IA, Financeiro etc. |
| Decisão antiga | Qual regra deixou de valer |
| Nova decisão | Qual regra passa a vigorar |
| Implementado? | Planejado, em demonstração, implementado ou validado |
| Evidência | Link para arquivo, teste, fonte ou relatório |

**Regras:**

1. Não promover uma **proposta** a **decisão aprovada** por repetição.
2. Em caso de conflito, a última decisão explícita do usuário no mesmo assunto prevalece, com registro de revogação.
3. Atualizar status real do protótipo somente após teste do arquivo correspondente.
4. Nunca declarar conexão com API, cofre seguro ou cobrança real quando houver apenas uma demonstração.
5. Criar novos backups versionados sem sobrescrever inadvertidamente a única cópia estável.
6. Não inserir dados reais sensíveis, API keys, senhas ou cartões neste documento.

## 52. Glossário

| Termo | Significado neste projeto |
|---|---|
| Ecommerce+ | Única organização proprietária e operadora do markethub |
| Cliente | Empresa cuja conta de marketplace é atendida pela Ecommerce+ |
| Produto | Item identificado e vinculado a um cliente |
| Bolinha | Representação espacial visual de um produto na Home |
| Workspace | Ambiente com abas e seções para criar/revisar materiais do produto |
| Launchpad | Painel de ferramentas, distinto do universo de produtos |
| Pacote Inteligente | Conjunto de materiais recomendado por categoria e personalizável |
| Modo Econômico | Perfil padrão que prioriza reutilização e templates, seguido de IA paga quando necessária |
| Storyboard | Sequência editável de cenas de vídeo antes da renderização |
| Material | Foto, arte, vídeo, texto, documento ou derivado gerenciado pelo sistema |
| Versão | Estado específico e rastreável de um material; alterações criam novas versões |
| Aprovação criativa | Decisão de qualidade/fidelidade do material |
| Liberação por canal | Decisão de permitir uso do material em marketplace específico |
| Job/Tarefa | Solicitação de processamento persistida e acompanhada no gerenciador |
| AI Router | Serviço de escolha de motor/provedor/modelo com checagem de orçamento |
| Orçamento global | Limite interno consolidado de IA da Ecommerce+ |
| Suborçamento | Limite de IA atribuído gerencialmente a um cliente |
| Reserva | Compromisso temporário de saldo antes de operação paga |
| Recarga | Evento de crédito/faturamento do provedor, sujeito a comprovação e distribuição |
| Reconciliação | Comparação entre estimativa/reserva e consumo/cobrança efetivos |
| Batch | Processamento assíncrono em lote quando suportado pelo provedor |
| ZIP seguro | Pacote com somente itens liberados e registro dos excluídos |
| Protótipo | Demonstração navegável, sem substituir operação real de backend |

---

# CONCLUSÃO EXECUTIVA

O **markethub** é uma **central interna de produção de conteúdo para os clientes gerenciados pela Ecommerce+**, com uma interface própria e visualmente distinta: **Home espacial formada por produtos**, pesquisa flutuante, Dock, Launchpad, animações e Workspace Adaptativo. O fluxo de trabalho foi estruturado em **Explorar → Criar → Produzir e Finalizar**, com geração em segundo plano, resultados progressivos, versão/histórico, revisão humana e exportação segura.

A estratégia econômica consolidada é **não associar milhares de produtos cadastrados a milhares de gerações pagas**. O Modo Econômico recomenda reaproveitamento de fotos, templates e geração seletiva; o Pacote Inteligente continua totalmente personalizável. Uma única carteira/gestão financeira da Ecommerce+ mantém suborçamentos por cliente, distribuição automática de recargas segundo regras autorizadas e **retomada após crédito confirmado**, sem eliminar a reconfirmação para vídeos/premium.

O estado do trabalho é: **protótipo HTML v2 existente, arquitetura funcional planejada, provedores sugeridos porém não contratados, backend/API keys reais ainda não implementados**. O próximo passo recomendado é usar esse documento como referência para revisar o protótipo, obter feedback da equipe e medir o custo/qualidade das APIs selecionadas em um piloto controlado, antes da implementação em produção.

> **Regra final de preservação:** decisões aprovadas devem ser mantidas; propostas técnicas devem continuar identificadas como propostas; o sistema do protótipo jamais deve sugerir que está pagando, salvando em nuvem ou gerando IA real quando apenas simula essas ações.

*Fim do Documento Mestre markethub v3.0 — revisão consolidada em 08/10/2026.*
