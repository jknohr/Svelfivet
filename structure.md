```markdown
. 📂 Canvas
└── 📂 Background/
│  ├── 📄 Canvas.svelte
│  ├── 📄 Canvas.types.ts
└── 📂 Graph/
│  ├── 📄 Graph.svelte
│  ├── 📄 Graph.types.ts
│  ├── 📄 GraphPersistence.ts
│  ├── 📄 GraphSerializer.ts
│  ├── 📄 TreeLayout3D.svelte
└── 📂 Svelvet/
│  ├── 📄 Svelvet.svelte
│  ├── 📄 Svelvet.types.ts
└── 📂 Theme/
│  ├── 📄 CanvasThemeProvider.svelte
└── 📂 constants/
│  ├── 📄 defaults.ts
│  ├── 📄 graph.ts
│  ├── 📄 index.ts
│  ├── 📄 math.ts
│  ├── 📄 styles.ts
└── 📂 db/
│  ├── 📄 SurrealConnection.ts
│  ├── 📄 SurrealManager.ts
│  ├── 📄 schema.surql
│  ├── 📄 types.ts
│  ├── 📄 utility.ts
├── 📄 index.js
├── 📄 index.ts
└── 📂 renderers/
│  └── 📂 GraphRenderer/
│    ├── 📄 GraphRenderer.svelte
│  └── 📂 GroupBoxRenderer/
│    ├── 📄 GroupBoxRenderer.svelte
└── 📂 stores/
│  ├── 📄 AnchorStore.ts
│  ├── 📄 ConnectingStore.ts
│  ├── 📄 CursorStore.ts
│  ├── 📄 EdgeStore.ts
│  ├── 📄 GraphStore.ts
│  ├── 📄 GroupStore.ts
│  ├── 📄 NodeStore.ts
│  ├── 📄 SelectionStore.ts
│  ├── 📄 ThemeStore.ts
│  ├── 📄 ViewportStore.ts
│  ├── 📄 base.ts
│  ├── 📄 context.ts
│  ├── 📄 index.ts
└── 📂 types/
│  ├── 📄 Tree.svelte
│  ├── 📄 index.ts
│  ├── 📄 logic.ts
│  ├── 📄 storage.ts
│  ├── 📄 store.ts
│  ├── 📄 stores.ts
│  ├── 📄 surrealdb.d.ts
│  ├── 📄 theme.ts
└── 📂 utils/
│  └── 📂 adders/
│    ├── 📄 populateStore.ts
│  └── 📂 calculators/
│    ├── 📄 index.ts
│  └── 📂 creators/
│    ├── 📄 createAnchor.ts
│    ├── 📄 createBoundsStore.ts
│    ├── 📄 createCursorEdge.ts
│    ├── 📄 createDerivedCursoreStore.ts
│    ├── 📄 createEdge.ts
│    ├── 📄 createEdgeStore.ts
│    ├── 📄 createGraph.ts
│    ├── 📄 createGraphStateManager.ts
│    ├── 📄 createNode.ts
│    ├── 📄 createStore.ts
│    ├── 📄 generateInput.ts
│    ├── 📄 generateOutput.ts
│    ├── 📄 index.ts
│  └── 📂 drawers/
│    ├── 📄 flowchartDrawer.ts
│  └── 📂 getters/
│    ├── 📄 getViewportCenter.ts
│  └── 📂 helpers/
│    ├── 📄 index.ts
│    ├── 📄 sortKey.ts
│  ├── 📄 index.ts
│  └── 📂 movers/
│    ├── 📄 index.ts
│    ├── 📄 moveNodes.ts
│    ├── 📄 zoomAndTranslate.ts
│  └── 📂 savers/
│    ├── 📄 reloadStore.ts
│    └── 📄 saveStore.ts
```