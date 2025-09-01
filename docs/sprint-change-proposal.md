# Sprint Change Proposal - Architectural Shift to Next.js with Python Backend

## 1. Analysis Summary

### Identified Issue
The project faced architectural ambiguity with competing PRDs (WordPress vs. Next.js Jamstack) and quality concerns in the current Next.js implementation. The core problem was uncertainty in technology stack choice despite the existing Next.js codebase, leading to potential rework and misalignment.

### Impact Assessment
- **Epic Impact**: All epics require updates, particularly Epic 3 (AI Integration) which now focuses on Python backend services.
- **Artifact Conflicts**: PRDs, architecture documents, and user stories need revision to reflect the new direction.
- **MVP Scope**: The original MVP remains achievable but with a shifted technical approach, enhancing AI capabilities while simplifying content management through autoblogging.

### Rationale for Chosen Path
The decision to keep Next.js for the frontend and integrate Python for AI backend services balances several factors:
- **Leverages Existing Investment**: Maintains the current Next.js codebase, minimizing rework.
- **Enhanced AI Capabilities**: Python's rich ecosystem for AI/ML (e.g., TensorFlow, PyTorch) better supports the project's AI-first goals.
- **Simplified Architecture**: Removing CMS/Strapi reduces complexity and maintenance overhead, replacing it with autoblogging for content generation.
- **Scalability and Performance**: Next.js provides SEO benefits via SSR/SSG, while Python backend services can scale independently for AI workloads.

## 2. Specific Proposed Edits

### 2.1 Update Jamstack PRD (`docs/jamstack-website-prd.md`)
**Changes:**
- **Section 1. Introduction**: Rewrite to reflect Python backend integration and autoblogging approach.
- **Section 7. Technical Specifications**: Update architecture diagram and tech stack to include Python backend.
- **Section 8. Content Management**: Replace CMS references with autoblogging details.
- **Section 9. Development Timeline**: Adjust phases to include Python backend setup.
- **Section 11. Cost Analysis**: Update estimates to include Python backend hosting.

**Proposed Text for Section 1:**
```
This PRD outlines the requirements for developing the Robofy website using a Next.js frontend with Python backend services for AI integration. The focus is on maintaining the current Next.js foundation while adding Python microservices for AI automation, removing CMS dependency in favor of autoblogging for content generation.
```

**Proposed Text for Section 7.2:**
```
- **Frontend:** Next.js 14+ with App Router and React 18
- **Backend:** Python microservices (FastAPI or Django) for AI processing
- **Database:** PostgreSQL for CRM data and AI processing
- **Hosting:** Separate hosting for Next.js frontend and Python backend services
- **AI Integration:** Python-based APIs for automation tasks
```

### 2.2 Archive WordPress PRD (`docs/wordpress-website-prd.md`)
**Change:**
- Add a deprecation notice at the top of the file:
```
## Deprecation Notice
This WordPress approach has been archived in favor of a Next.js frontend with Python backend architecture. Refer to the updated Jamstack PRD for current requirements.
```

### 2.3 Update User Stories and Epics
**Changes to Stories:**
- **Story 1.1: Initialize Next.js Project**: Add tasks for Python backend setup and update acceptance criteria to include backend integration.
- **Story 3.1: Implement AI Integration**: Rewrite to focus on Python backend services, with new acceptance criteria:
  1. Python backend service setup with FastAPI/Django
  2. REST API endpoints for AI content generation
  3. Secure authentication between Next.js and Python services
  4. Performance monitoring for AI endpoints
- **Story 3.2: Setup CRM Database**: Update to include Python service access for lead management.
- **New Story**: Add a story for Python backend implementation if needed.

**Proposed Text for Story 3.1 Revision:**
```
# Story 3.1: Implement AI Integration with Python Backend

## Acceptance Criteria
1. Python backend service setup with FastAPI/Django
2. REST API endpoints for AI content generation and processing
3. Integration between Next.js frontend and Python backend via secure APIs
4. Error handling and logging for AI services
5. Performance metrics monitoring for AI endpoints

## Tasks
- Set up Python project structure with virtual environment
- Implement AI model integration endpoints (e.g., content generation, lead scoring)
- Create API documentation and client libraries for Next.js integration
- Add authentication (e.g., JWT tokens) for service-to-service communication
- Implement rate limiting and security measures for APIs
```

### 2.4 Create Revised Architecture Document
**Change:**
- Create a new architecture document or update the existing one to reflect the hybrid approach:
```
# Architecture Overview
- **Frontend:** Next.js 14+ with App Router, serving static and dynamic content
- **Backend:** Python microservices (FastAPI) for AI tasks, communicating via REST APIs
- **Database:** PostgreSQL for CRM data, accessed by Python services
- **Content Generation:** Autoblogging via Python scripts, generating static content for Next.js
- **Hosting:** Next.js on Vercel/Netlify, Python backend on cloud services (e.g., AWS Lambda, Heroku)

# Data Flow
1. Next.js frontend handles user requests and serves content
2. AI requests are sent to Python backend via APIs
3. Python services process AI tasks and store results in PostgreSQL
4. Autoblogging scripts generate content files consumed by Next.js at build time
```

### 2.5 Update Package.json and Dependencies
**Changes:**
- Add a `requirements.txt` file for Python dependencies:
```
fastapi==0.104.1
uvicorn==0.24.0
python-dotenv==1.0.0
# Add AI libraries as needed (e.g., transformers, torch)
```
- Update `package.json` to include scripts for starting both services:
```json
"scripts": {
  "dev:frontend": "next dev",
  "dev:backend": "cd backend && uvicorn main:app --reload",
  "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\""
}
```

### 2.6 Update Validation Report (`docs/updated-validation-report.md`)
**Change:**
- Add a section noting the architectural shift:
```
## Architectural Change
The project has shifted to a Next.js frontend with Python backend architecture to better support AI integration and simplify content management via autoblogging. This change addresses scalability and performance needs while maintaining the core MVP functionality.
```

## 3. Next Steps
1. **Implement Changes**: Apply the proposed updates to artifacts as described.
2. **Development**: Begin Python backend setup and integrate with Next.js frontend.
3. **Testing**: Validate the new architecture with prototypes and ensure seamless communication between services.
4. **Documentation**: Update all relevant documentation to reflect the new approach.

## 4. Approval
This proposal requires explicit approval to proceed with the architectural changes. Please review and confirm agreement with the proposed direction.

---
*This Sprint Change Proposal is based on the change checklist analysis and collaborative discussion.*