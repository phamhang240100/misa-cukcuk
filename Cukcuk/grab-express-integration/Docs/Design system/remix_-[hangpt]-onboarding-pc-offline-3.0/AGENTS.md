# Custom Interaction Protocol & Style Matching Rules

## 1. Custom Interaction Protocol (MANDATORY WORKFLOW)
Whenever the user provides a new idea, business rules, task, or application concept (optionally with images/mockups):
1. **Explain & Summarize FIRST**: The AI agent **MUST NOT** write, modify, or compile any application code yet. Instead, the agent must explain, interpret, and summarize the user's requirements and design concept to align understanding.
2. **Wait for Explicit Approval**: The agent must wait for the user to explicitly say **"Oke rồi, bắt đầu build"** (or similar explicit approval).
3. **Execute only after approval**: Only after receiving the approval prompt can the agent begin editing files, installing packages, compiling, or building the application.

---

## 2. Mockup & Illustration Matching Rule
Always design and implement the user interface to match the exact visual style, layout, color scheme, typography, and functional components depicted in the user's uploaded images, mockups, or detailed descriptions. Prioritize pixel-perfect replication of their design concept over any pre-defined design system.
