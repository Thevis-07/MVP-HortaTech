# 🌿 Estufa Monitor — Dashboard

Dashboard de monitoramento em tempo real da estufa, com dados do Firebase Realtime Database.

## Sensores suportados

- **sensor_1_solo_umidade** — Umidade do solo (Sensor 1)
- **sensor_2_solo_umidade** — Umidade do solo (Sensor 2)
- **sensor_ar_temperatura_umidade** — Temperatura e umidade do ar

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Firebase

Crie um arquivo `.env` na raiz do projeto com as variaveis:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_AUTH_EMAIL=
NEXT_PUBLIC_FIREBASE_AUTH_PASSWORD=
```

Voce tambem pode copiar de `.env.example`.

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### 4. Build para produção

```bash
npm run build
npm start
```

## Funcionalidades

- ✅ Autenticação automática no Firebase
- ✅ Dados em tempo real (WebSocket via Firebase)
- ✅ Cards com leitura atual, média e tendência
- ✅ Gráfico comparativo dos sensores de solo
- ✅ Gráfico combinado de temperatura + umidade do ar
- ✅ Tabelas de histórico para cada sensor
- ✅ Paleta verde orgânica, layout responsivo

## Estrutura

```
estufa-dashboard/
├── app/
│   ├── layout.tsx         # Layout raiz com fonts
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globais
├── components/
│   ├── Dashboard.tsx      # Componente principal
│   ├── Header.tsx         # Cabeçalho com status
│   ├── StatCard.tsx       # Cards de métricas
│   ├── SoloUmidadeChart.tsx  # Gráfico do solo
│   ├── ArChart.tsx        # Gráfico de ar
│   ├── HistoryTable.tsx   # Tabelas de histórico
│   └── LoadingScreen.tsx  # Tela de carregamento
└── lib/
    ├── firebase.ts        # Configuração Firebase
    └── useFirebaseData.ts # Hook de dados em tempo real
```
