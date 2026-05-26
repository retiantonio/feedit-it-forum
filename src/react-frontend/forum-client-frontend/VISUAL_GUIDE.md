# Visual Guide - Post Actions Menu

## Question Card Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│  VOTE  │  [Categories]  [Tags]  ...                             ⋮  │
│ PANEL  │                                                             │
│        │  Question Title                                             │
│        │  Question body preview text here...                         │
│        │                                                             │
│        │  By @author • 5 Answers • 2 days ago • [Report]            │
└─────────────────────────────────────────────────────────────────────┘
```

When clicking the ⋮ button, a dropdown menu appears:
```
    ┌──────────────┐
    │ ✏️  Edit    │
    ├──────────────┤
    │ 🗑️  Delete  │
    └──────────────┘
```

## Edit Mode
```
┌─────────────────────────────────────────────────────────────────────┐
│  VOTE  │  [Edit Form]                                               │
│ PANEL  │  ┌─────────────────────────────────────────────────────┐  │
│        │  │ Question Title (editable input)                   │  │
│        │  └─────────────────────────────────────────────────────┘  │
│        │                                                             │
│        │  ┌─────────────────────────────────────────────────────┐  │
│        │  │ Question body (editable textarea)                 │  │
│        │  │                                                   │  │
│        │  │                                                   │  │
│        │  └─────────────────────────────────────────────────────┘  │
│        │                                                             │
│        │  [Save]  [Cancel]                                          │
└─────────────────────────────────────────────────────────────────────┘
```

## Answer Card Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ 🔶 │  u/author  2 days ago                                    ⋮ │
│    │                                                              │
│    │  Answer body text here...                                   │
│    │                                                              │
│    │  👍 Vote  💬 Reply  📤 Share  [Report]                     │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy
```
QuestionCard
├── VotePanel
├── PostActionsMenu ← NEW
│   ├── Edit Handler
│   └── Delete Handler
└── ReportButton

AnswerCard
├── PostActionsMenu ← NEW
│   ├── Edit Handler
│   └── Delete Handler
├── HorizontalVotePanel
├── AnswerForm (for replies)
└── AnswerCard (nested replies)
    ├── PostActionsMenu ← NEW
    └── ... (recursive)
```

## State Flow
```
User clicks ⋮ menu
    ↓
1. Edit path:
   - setIsEditing(true)
   - Show edit form
   - User edits content
   - Click Save → API call → Update state → Close form
   
2. Delete path:
   - Show confirmation dialog
   - User confirms
   - API call → onDelete callback → Remove from UI
```
