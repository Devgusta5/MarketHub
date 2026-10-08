# MarketHub — Briefing de Branding, UI/UX e Frontend

> Documento de referência para orientar a identidade visual e a experiência do MarketHub, uma plataforma B2B para organizar produtos, conteúdos e operações em múltiplos marketplaces.
>
> **Este é o documento de autoridade.** Em conflito com DESIGN.md ou com o código, o briefing manda.

## 1. Resumo executivo

**MarketHub** é uma plataforma web para centralizar, organizar e preparar informações e conteúdos de produtos antes de distribuí-los para diferentes marketplaces. Atua como uma camada de inteligência e operação entre os produtos, os conteúdos, os canais de venda e sistemas complementares, como o Bling.

A marca deve comunicar **centralização, controle, clareza, eficiência e confiança**. A interface deve transformar uma operação potencialmente fragmentada em um fluxo compreensível, consistente e acionável.

**Ideia central:** complexidade → centralização → controle.

**Sensação desejada ao abrir o produto:** "Agora está tudo no lugar."

**Direção estética:** software operacional + plataforma SaaS premium + ferramenta de produtividade. Interface minimalista, predominantemente escura, com grafite e laranja como assinatura, além de temas claro e sistema.

## 2. Sobre o produto

- **Nome oficial:** MarketHub
- **Categoria:** Web app B2B / SaaS para operações de e-commerce e marketplaces
- **Usuários principais:** assistentes e analistas de e-commerce, operadores e gestores de marketplace, gestores de catálogo e equipes de marketing/e-commerce
- **Contexto de uso:** empresas com grandes catálogos, múltiplos canais de venda e processos de publicação em Mercado Livre, Shopee, Amazon e outros canais
- **Sistemas relacionados:** ERPs, como Bling

O MarketHub não pretende substituir o Bling nem ser apenas mais um ERP ou um CRUD de produtos. Seu papel é organizar informações, mídia, conteúdo, inteligência operacional e adaptações por marketplace.

## 3. Problema e valor entregue

Um mesmo produto pode ter SKU, título, descrição, atributos, categoria, informações fiscais, palavras-chave, imagens, vídeos e versões diferentes para cada canal. Quando esses dados ficam espalhados em planilhas, arquivos e sistemas distintos, surgem retrabalho, duplicidade, inconsistências, atualização difícil e anúncios divergentes.

O MarketHub deve ajudar a:

- centralizar a fonte principal de informação do produto;
- identificar o que está incompleto ou precisa de revisão;
- preparar conteúdo e mídia em um fluxo organizado;
- adaptar os dados para as exigências de cada marketplace;
- acompanhar a prontidão e a publicação por canal;
- reduzir trabalho manual e dar visibilidade à operação.

**Proposta de valor:** menos trabalho manual, mais controle sobre a operação.

## 4. Posicionamento e personalidade

O MarketHub deve ser percebido como uma ferramenta:

- profissional e confiável;
- moderna e tecnológica, sem parecer futurista;
- organizada e eficiente;
- inteligente, com automação integrada ao trabalho;
- orientada a operações reais e preparada para crescer.

A marca precisa parecer sólida o suficiente para uso diário por uma equipe profissional, mesmo enquanto o produto ainda está em MVP.

### Princípios de marca

1. **Centralização:** o MarketHub é o ponto de referência para produtos e conteúdos.
2. **Clareza:** complexidade operacional deve virar informação compreensível.
3. **Controle:** estados, pendências e próximos passos devem estar visíveis.
4. **Eficiência:** as ações importantes devem exigir o mínimo de esforço e contexto perdido.
5. **Inteligência prática:** IA e automação são recursos de trabalho, não decoração.

### Tom de voz

Direto, profissional, claro, objetivo e contemporâneo. Evitar jargão desnecessário, linguagem excessivamente corporativa, informalidade exagerada, emojis em excesso e frases vazias de marketing.

**Exemplos de microcopy:**

- "Produto pronto para publicação"
- "3 informações precisam de revisão"
- "Título gerado com IA"
- "Conteúdo atualizado"
- "Sincronização concluída"
- "Falta informar o material do produto"

### Tagline

Direção recomendada para explorar: **"Centralize. Otimize. Publique."**

Outras opções a validar com a identidade final:

- "O hub da sua operação de marketplace."
- "Tudo sobre seus produtos. Em um só lugar."
- "Da informação ao marketplace."

## 5. Direção visual e identidade

A inspiração é a qualidade de ferramentas modernas de produtividade e plataformas SaaS premium: hierarquia clara, bom espaçamento, tipografia legível, simplicidade e acabamento consistente. Referências como Linear, Vercel, Stripe, Notion e Shopify são apenas referências de qualidade e padrões — não devem ser copiadas.

### O que a identidade deve evitar

- aparência genérica de SaaS baseada em cards arredondados, blobs e gradiente em excesso;
- neon, cyberpunk ou estética sci-fi;
- dashboard congestionado de gráficos sem utilidade;
- carrinho, caixa ou sacola como símbolo principal;
- IA como protagonista absoluta;
- excesso de cores, sombras, efeitos e ornamentos;
- cópia visual de marcas de referência.

## 6. Logo e sistema de marca

### Conceito recomendado

Criar um símbolo próprio a partir da letra **M** e da ideia de hub: um centro conectado a pontos ou direções externas. O símbolo pode sugerir convergência e distribuição sem ser literal demais.

### Aplicações necessárias

- logo principal com símbolo e wordmark "MarketHub";
- versão horizontal e, se necessário, empilhada;
- símbolo isolado para favicon, avatar e sidebar;
- versões para fundos claros e escuros;
- aplicação monocromática para contextos de baixa complexidade visual.

"Hub" pode receber um destaque cromático sutil no wordmark, desde que a leitura do nome continue imediata. O símbolo precisa permanecer reconhecível em tamanhos pequenos.

## 7. Paleta de cores e temas

### Tema escuro — direção padrão inicial

| Token | Valor sugerido | Uso |
|---|---:|---|
| `background` | `#0D0F11` | Fundo principal |
| `surface` | `#15181C` | Sidebar, painéis e superfícies |
| `surface-raised` | `#1C2025` | Cards, menus e elementos elevados |
| `border` | `#2A3037` | Bordas e divisórias discretas |
| `text-primary` | `#F4F6F8` | Texto principal |
| `text-secondary` | `#A6AFB8` | Texto auxiliar |
| `accent` | `#F97316` | Ação principal, seleção e foco de marca |
| `accent-strong` | `#C2410C` | Acento mais escuro, especialmente em tema claro |
| `accent-gradient` | `#FF8A3D → #E85D04` | Uso pontual em marca ou detalhes especiais |

Usar grafites, não preto absoluto em todas as superfícies. O gradiente deve ser um detalhe da identidade, não o plano de fundo recorrente da aplicação.

### Cores semânticas

Definir tokens próprios para sucesso, atenção, erro e informação, distintos da cor de marca. A cor de destaque escolhida pelo usuário não deve sobrescrever as cores semânticas dos estados.

### Personalização de aparência

Em **Configurações → Aparência**, oferecer:

- tema claro, escuro ou seguir sistema;
- cor de destaque: laranja (padrão), azul, violeta, verde ou turquesa;
- densidade confortável ou compacta, caso isso faça sentido para o catálogo.

As alternativas de cor devem ser poucas e testadas quanto a contraste. A escolha deve afetar botões, seleção e foco — não os estados de erro, sucesso ou pendência.

## 8. Tipografia, iconografia e linguagem visual

### Tipografia

Priorizar sans-serif contemporânea e altamente legível. **Geist** é a primeira opção sugerida; **Inter**, Manrope, Plus Jakarta Sans ou DM Sans são alternativas. Validar legibilidade em tabelas, números, labels, formulários e títulos.

Usar uma escala tipográfica consistente, com hierarquia explícita entre título de página, subtítulo, título de seção, corpo, rótulo e metadado. Evitar muitos pesos e tamanhos concorrentes.

### Iconografia

Preferir ícones lineares consistentes, como Lucide. Usar ícones para apoiar a compreensão, sem substituir labels importantes. Evitar mistura de estilos, excesso de ícones ou símbolos ambíguos.

## 9. Experiência e arquitetura da informação

### Fluxo central do produto

**Produto base → completar informações → preparar conteúdo → adaptar ao canal → revisar → publicar/sincronizar**

Esse fluxo deve ser evidente na navegação e na página do produto. O usuário precisa conseguir responder rapidamente:

- O que está pendente?
- O que está impedindo a publicação?
- Qual é a próxima ação recomendada?
- Em qual marketplace o produto está pronto, publicado ou com erro?

### Navegação sugerida

Sidebar compacta, previsível e com rótulos claros:

- Dashboard
- Produtos
- Conteúdo
- Assistente de IA (ou acesso contextual, caso não seja um módulo independente no MVP)
- Marketplaces
- Configurações

A navegação deve destacar claramente a seção ativa e preservar o contexto ao entrar e sair de um produto.

### Módulos do produto

- **Product Hub:** produtos, SKUs, categorias, informações, atributos, descrições, imagens e vídeos.
- **Content Studio:** criação e organização de títulos, descrições, tags, imagens, vídeos e conteúdo gerado ou editado com IA.
- **AI Assistant:** sugestões de títulos, descrições, tags, atributos e melhorias; apoio à identificação e adaptação de informações.
- **Marketplace Adapter:** conversão do produto base para campos, regras e formatos específicos de cada canal.

## 10. Dashboard

O dashboard deve responder à pergunta: **"Qual é o estado da minha operação?"**

Indicadores possíveis, selecionados pela utilidade real:

- total de produtos;
- produtos completos e incompletos;
- itens aguardando revisão;
- produtos prontos ou publicados;
- conteúdo pendente;
- estado por marketplace;
- atividades recentes e sincronizações relevantes.

Evitar encher a tela com gráficos apenas para parecer analítica. Cada indicador deve ajudar a tomar uma decisão ou conduzir a uma ação. Dar destaque a pendências acionáveis e permitir chegar ao item correspondente com poucos passos.

## 11. Catálogo de produtos

O catálogo é uma área crítica para operações com muitos itens. Deve equilibrar densidade e leitura.

### Recomendações

- busca clara e filtros úteis;
- ordenação previsível;
- SKU e identificador fáceis de localizar;
- status de produto e situação por canal visíveis;
- filtros que possam ser combinados;
- seleção de várias linhas e ações em lote, planejadas para evolução;
- preservação dos filtros e do contexto ao abrir e voltar de um produto;
- feedback de progresso para operações em lote e possibilidade de desfazer quando segura e viável.

Pensar na evolução para catálogos grandes desde o início, sem sobrecarregar o MVP com controles que ainda não têm utilidade comprovada.

## 12. Página do produto

A página do produto deve ser a fonte central e confiável de informação e uma central de trabalho — não uma ficha longa e passiva.

### Estrutura recomendada

1. **Cabeçalho compacto:** nome, SKU, estado geral e ações primárias.
2. **Resumo de completude:** por exemplo, "8 de 10 informações essenciais".
3. **Pendências acionáveis:** explicam o que falta e levam diretamente ao campo relevante.
4. **Informações base:** título, descrição, categoria, atributos e dados do produto.
5. **Mídia e conteúdo:** imagens, vídeos, tags e conteúdo associado.
6. **Marketplaces:** estado independente e conteúdo adaptado de cada canal.
7. **Histórico ou atividade:** alterações, geração de conteúdo e sincronizações relevantes, conforme escopo.

A distinção entre **produto base** e **versão específica do marketplace** deve ser inequívoca. O usuário precisa saber o que será alterado, onde a alteração será aplicada e se o conteúdo está em revisão ou aprovado.

## 13. Estados e badges

Os estados são parte essencial da experiência operacional. Separar conceitualmente:

### Estado do produto

- Rascunho
- Incompleto
- Em revisão
- Completo

### Estado do canal/marketplace

- Não configurado
- Com pendências
- Pronto
- Publicado ou sincronizado
- Erro

### Estado do conteúdo

- Original
- Gerado com IA
- Editado
- Aguardando aprovação
- Aprovado

Os rótulos finais devem refletir o comportamento real do sistema e não sugerir publicação se o item estiver apenas preparado. Não depender apenas da cor: combinar texto, ícone e cor. Explicar pendências com linguagem concreta e, quando possível, oferecer o próximo passo.

## 14. IA integrada ao fluxo

A IA deve aparecer no contexto em que resolve uma tarefa, não como chatbot isolado ou elemento decorativo.

Exemplos de ação contextual:

- "Sugerir título otimizado"
- "Melhorar descrição"
- "Resumir"
- "Sugerir tags"
- "Adaptar para este marketplace"

### Regras de experiência

- mostrar prévia antes de aplicar;
- permitir aceitar, editar ou descartar;
- destacar o que mudou;
- não sobrescrever silenciosamente conteúdo aprovado;
- diferenciar claramente "gerado" de "aprovado" e "publicado";
- sinalizar quando a validação humana for necessária;
- manter o usuário responsável pela decisão final.

## 15. Componentes do design system

Estabelecer padrões consistentes para:

- botões e links;
- campos, selects e áreas de texto;
- cards e painéis;
- tabelas e listas;
- badges e indicadores de estado;
- modais e drawers;
- menus e dropdowns;
- tabs;
- tooltips;
- estados vazios;
- estados de carregamento e skeletons;
- notificações/toasts;
- uploads e progresso de arquivos;
- alertas e confirmações.

Definir escalas compartilhadas de espaçamento, raio, borda, sombra, tipografia e duração de movimento. O design system deve evitar valores avulsos repetidos entre componentes.

## 16. Movimento, hover e feedback

Animações devem confirmar uma ação ou esclarecer uma relação. Não devem competir com o trabalho.

### Comportamentos sugeridos

- hover sutil em botões, linhas e elementos clicáveis;
- estados de foco visíveis;
- abertura e fechamento de menus e modais com transição curta;
- atualização de status sem efeitos excessivos;
- feedback claro para salvamento, upload e sincronização;
- preferência do sistema por movimento reduzido respeitada.

Como ponto de partida, usar transições curtas, aproximadamente **120–220 ms**, e ajustar após testar no produto. Evitar animação em todos os elementos, efeitos elásticos ou gradientes em movimento.

## 17. Acessibilidade e legibilidade

Acessibilidade faz parte do acabamento profissional. Validar:

- contraste de texto e componentes nos temas claro e escuro;
- navegação integral por teclado;
- foco visível e ordem de tabulação coerente;
- nomes e rótulos acessíveis para controles;
- áreas clicáveis confortáveis;
- mensagens de erro associadas aos respectivos campos;
- estados comunicados por texto e ícone, além da cor;
- comportamento com preferência de movimento reduzido.

Evitar texto pequeno em laranja sobre fundo escuro. No tema claro, preferir o laranja profundo para texto de tamanho reduzido e verificar contraste nas combinações finais.

## 18. Estados operacionais e mensagens

Planejar estados para cada tela e ação importante, e não apenas a visualização ideal:

- carregando;
- vazio;
- erro;
- desabilitado;
- selecionado;
- foco por teclado;
- salvamento em andamento;
- alterações não salvas;
- sincronização ou upload em andamento;
- sucesso e falha parcial.

### Diretrizes de feedback

- usar skeletons em áreas de conteúdo previsível;
- em estados vazios, explicar o que é a área e qual ação iniciar;
- mostrar progresso para tarefas demoradas;
- usar toasts curtos para confirmações simples;
- explicar erros com causa conhecida e ação de resolução;
- avisar sobre alterações não salvas e prevenir perda de trabalho;
- confirmar ações em lote destrutivas ou difíceis de reverter.

**Exemplo de mensagem útil:** "Não foi possível sincronizar porque falta o identificador do anúncio na Shopee."

## 19. Diretrizes de frontend

### Tokens e semântica

Definir tokens de design para cores, espaçamentos, tipografia, raios, bordas, elevação e movimento. Usar nomes semânticos — como `background`, `surface`, `text-primary`, `border`, `accent` e `status-error` — em vez de espalhar valores hexadecimais pelas telas.

A troca de tema deve ocorrer nos tokens, preservando a semântica. A cor escolhida pelo usuário pode controlar os elementos de marca, mas não deve alterar o significado de um erro ou sucesso.

### Componentes e estados

Criar componentes compartilhados para padrões recorrentes e manter consistência entre telas. Cada componente relevante deve definir seus estados (normal, hover, foco, selecionado, desabilitado, carregando e erro, conforme aplicável).

### Organização do trabalho

- mapear o fluxo antes de construir muitas telas;
- validar primeiro catálogo e página do produto;
- evitar duplicação de lógica de estado entre canais;
- manter separados os dados do produto base e as adaptações de marketplace;
- prever operações com grandes listas e feedback de ações assíncronas;
- documentar padrões e decisões de interface para manter consistência conforme o produto crescer.

## 20. Priorização recomendada para o MVP

1. **Catálogo:** busca, filtros, leitura de SKU e estados confiáveis.
2. **Página do produto:** informação central, completude e pendências acionáveis.
3. **Modelo de produto base e adaptações por marketplace:** separação explícita entre dados gerais e específicos do canal.
4. **Estados essenciais:** carregamento, vazio, erro, sucesso e alterações não salvas.
5. **Design system base:** tokens, componentes compartilhados e consistência de tema.
6. **Tema escuro e claro:** com contraste e legibilidade validados.
7. **IA contextual:** prévia, controle humano e indicação do que mudou.
8. **Ações em lote e personalização adicional:** evoluir conforme necessidade observada na operação.

Essa ordem privilegia os trabalhos repetidos e os pontos de decisão da operação, em vez de começar por elementos decorativos ou métricas sem ação associada.

## 21. Critérios de qualidade da experiência

Considerar a direção bem-sucedida quando:

- uma pessoa consegue identificar rapidamente produtos incompletos e pendências;
- é fácil entender o estado de cada produto e de cada canal;
- produto base e conteúdo específico por marketplace não se confundem;
- cada erro ou pendência orienta uma próxima ação;
- sugestões de IA podem ser revisadas sem perda de controle;
- tema e cor de destaque mantêm contraste e significado dos estados;
- a interface funciona bem com teclado e movimento reduzido;
- o dashboard prioriza decisões, sem excesso de informação;
- as telas parecem parte de um único sistema consistente.

## 22. Síntese da direção

**MarketHub transforma a complexidade de gerenciar produtos em múltiplos marketplaces em uma operação centralizada, organizada e inteligente.**

A identidade visual deve mostrar essa transformação: um centro confiável que reúne informações e prepara cada produto para seguir ao canal certo. A experiência deve fazer o trabalho parecer mais simples porque mostra com clareza o que existe, o que falta e como avançar.

> **Princípio final:** primeiro clareza e controle; depois, refinamento visual. O produto deve impressionar pela facilidade com que ajuda a encontrar e resolver o próximo problema — não pela quantidade de efeitos.
