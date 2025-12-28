# Deployment Implementation Plan - Option B: Stable Foundation

**Project:** Multi-Environment CI/CD Setup
**Option:** B - Stable Foundation (Recommended)
**Status:** Ready for Implementation
**Prepared:** 2025-12-28
**Estimated Duration:** 1-2 days
**Budget:** $260-340 first invoice + $21/month ongoing

---

## Executive Summary

This implementation plan details the execution strategy for establishing a professional three-environment deployment system (localhost, staging, production) with automated CI/CD workflows. Option B focuses on resolving existing technical issues before implementing automated deployment infrastructure.

**Key Deliverables:**
- Fully functional staging environment at staging.becomingdiamond.com
- Automated deployment from Git branches
- Resolved technical build and configuration issues
- Complete documentation and team training

---

## Implementation Phases

### Phase 1: Technical Issue Resolution (4-6 hours)

**Objective:** Fix existing build and configuration issues to ensure stable foundation

#### Task 1.1: Build System Verification
**Duration:** 1-2 hours

**Actions:**
- [ ] Audit current build process (`npm run build`)
- [ ] Identify and document all build warnings/errors
- [ ] Review Turbopack configuration in `next.config.ts`
- [ ] Verify `--legacy-peer-deps` requirement in `package.json`
- [ ] Test build locally with clean install

**Validation Criteria:**
- Build completes without errors
- Zero critical warnings
- Output directory (`.next/`) properly generated
- All routes accessible in production build

**Technical Details:**
```bash
# Clean build test
rm -rf .next node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
npm start  # Verify production build works
```

#### Task 1.2: Environment Variable Audit
**Duration:** 1 hour

**Actions:**
- [ ] Document all required environment variables
- [ ] Separate localhost/staging/production configs
- [ ] Identify missing or misconfigured variables
- [ ] Create environment variable templates
- [ ] Validate OAuth redirect URIs for each environment

**Required Variables by Environment:**

**Localhost:**
```bash
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3003
NEXTAUTH_SECRET=[generate-new]

# Database (shared with staging initially)
TURSO_DATABASE_URL=[staging-db]
TURSO_AUTH_TOKEN=[staging-token]

# OAuth (development apps)
AUTH_GOOGLE_ID=[localhost-oauth-id]
AUTH_GOOGLE_SECRET=[localhost-oauth-secret]

# Stripe (test mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[test-key]
STRIPE_SECRET_KEY=[test-secret-key]

# Bunny Stream (shared)
BUNNY_STREAM_LIBRARY_ID=512164
BUNNY_STREAM_API_KEY=[api-key]
BUNNY_STREAM_CDN_HOSTNAME=vz-xxxxxxx-xxx.b-cdn.net

# Email (test)
SMTP_HOST=smtp.gmail.com
SMTP_USER=[test-email]
SMTP_PASS=[app-password]

# Logging
AXIOM_TOKEN=[axiom-token]
AXIOM_DATASET=becoming-diamond-dev
```

**Staging:**
```bash
NODE_ENV=production
NEXTAUTH_URL=https://staging.becomingdiamond.com
NEXTAUTH_SECRET=[unique-secret]

# Database (staging)
TURSO_DATABASE_URL=[staging-db-url]
TURSO_AUTH_TOKEN=[staging-token]

# OAuth (staging apps)
AUTH_GOOGLE_ID=[staging-oauth-id]
AUTH_GOOGLE_SECRET=[staging-oauth-secret]

# Stripe (test mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[test-key]
STRIPE_SECRET_KEY=[test-secret-key]

# Bunny, Email, Logging (shared with production)
```

**Production:**
```bash
NODE_ENV=production
NEXTAUTH_URL=https://becomingdiamond.com
NEXTAUTH_SECRET=[unique-secret]

# Database (production)
TURSO_DATABASE_URL=[prod-db-url]
TURSO_AUTH_TOKEN=[prod-token]

# OAuth (production apps)
AUTH_GOOGLE_ID=[prod-oauth-id]
AUTH_GOOGLE_SECRET=[prod-oauth-secret]

# Stripe (live mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[live-key]
STRIPE_SECRET_KEY=[live-secret-key]

# Bunny, Email, Logging
```

**Deliverable:** Environment variable checklist and configuration templates

#### Task 1.3: Code Quality Tools Configuration
**Duration:** 1-2 hours

**Actions:**
- [ ] Fix ESLint configuration issues
- [ ] Resolve Knip unused code detection
- [ ] Configure Prettier (if needed)
- [ ] Run `npm run lint:fix` and resolve issues
- [ ] Run `npm run knip` and review findings
- [ ] Update `.eslintrc` if needed

**Validation Criteria:**
- `npm run lint` passes with zero errors
- `npm run knip` runs without crashes
- Code quality baseline established

**Known Issues to Address:**
- Aceternity UI components in `src/components/ui/` should be excluded from linting
- Unused exports in API routes (false positives)
- TypeScript strict mode configurations

#### Task 1.4: Dependency Resolution
**Duration:** 1 hour

**Actions:**
- [ ] Review `package.json` for conflicting peer dependencies
- [ ] Document why `--legacy-peer-deps` is required
- [ ] Update `vercel.json` install command
- [ ] Test clean install process
- [ ] Verify all critical dependencies load correctly

**Critical Dependencies:**
- Next.js 16.1.0
- React 19
- Tailwind CSS 4
- NextAuth v5
- Turso client
- Framer Motion (Aceternity UI)

---

### Phase 2: Vercel Configuration (2-3 hours)

**Objective:** Set up hosting infrastructure with proper environment separation

#### Task 2.1: Vercel Account Setup
**Duration:** 30 minutes

**Actions:**
- [ ] Transfer Vercel billing to client account
- [ ] Upgrade to Vercel Pro ($20/month)
- [ ] Configure organization settings
- [ ] Add team members (if applicable)
- [ ] Set up billing alerts

**Required Information:**
- Client credit card for billing
- Billing email address
- Organization name

#### Task 2.2: Project Configuration
**Duration:** 1 hour

**Actions:**
- [ ] Connect GitHub repository to Vercel
- [ ] Configure production branch (`main`)
- [ ] Configure staging branch (`staging`)
- [ ] Disable auto-deployment for preview branches
- [ ] Set build command: `npm run build`
- [ ] Set install command: `npm install --legacy-peer-deps`
- [ ] Configure root directory and output directory

**Vercel Project Settings:**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "outputDirectory": ".next",
  "devCommand": "npm run dev"
}
```

#### Task 2.3: Environment Variables Setup
**Duration:** 1 hour

**Actions:**
- [ ] Add all production environment variables
- [ ] Add all staging environment variables (preview scope)
- [ ] Configure environment-specific values
- [ ] Test variable encryption
- [ ] Document variable sources (where to find values)

**Vercel Environment Scopes:**
- Production: `main` branch only
- Preview: `staging` branch
- Development: localhost (not deployed)

#### Task 2.4: Custom Domain Setup
**Duration:** 30 minutes

**Actions:**
- [ ] Configure staging.becomingdiamond.com subdomain
- [ ] Add DNS records (A/CNAME)
- [ ] Verify SSL certificate provisioning
- [ ] Test HTTPS redirects
- [ ] Verify production domain (becomingdiamond.com) unchanged

**DNS Configuration:**
```
Type: CNAME
Name: staging
Value: cname.vercel-dns.com
TTL: 3600
```

---

### Phase 3: Git Workflow Setup (1 hour)

**Objective:** Establish branch strategy and deployment triggers

#### Task 3.1: Branch Structure
**Duration:** 30 minutes

**Actions:**
- [ ] Create `staging` branch from `main`
- [ ] Configure branch protection rules
- [ ] Set up merge strategy (staging → main)
- [ ] Document branching workflow
- [ ] Configure GitHub Actions (if needed)

**Branch Strategy:**
```
main (production)
  ↑
  merge after approval
  ↑
staging (preview/staging)
  ↑
  feature branches
  ↑
local development
```

#### Task 3.2: Deployment Triggers
**Duration:** 30 minutes

**Actions:**
- [ ] Test automatic deployment from staging branch
- [ ] Test automatic deployment from main branch
- [ ] Configure deployment notifications
- [ ] Set up rollback procedures
- [ ] Document emergency rollback process

**Deployment Flow:**
1. Push to `staging` branch → auto-deploy to staging.becomingdiamond.com
2. Test on staging environment
3. Merge staging → main (via PR) → auto-deploy to becomingdiamond.com
4. Monitor production deployment

---

### Phase 4: OAuth Configuration (1-2 hours)

**Objective:** Configure separate OAuth apps for staging and production

#### Task 4.1: Google OAuth Setup
**Duration:** 1 hour

**Actions:**
- [ ] Create separate Google OAuth app for staging
- [ ] Configure authorized redirect URIs for staging
- [ ] Verify production OAuth app redirect URIs
- [ ] Test OAuth flow on staging
- [ ] Update environment variables

**Staging Redirect URIs:**
```
https://staging.becomingdiamond.com/api/auth/callback/google
https://staging.becomingdiamond.com/auth/signin
```

**Production Redirect URIs:**
```
https://becomingdiamond.com/api/auth/callback/google
https://becomingdiamond.com/auth/signin
```

#### Task 4.2: Decap CMS OAuth Setup
**Duration:** 30 minutes

**Actions:**
- [ ] Update `/public/admin/config.yml` for staging
- [ ] Configure GitHub OAuth for staging CMS
- [ ] Test CMS access on staging environment
- [ ] Verify production CMS unchanged
- [ ] Update `base_url` for environment

**Staging CMS Config:**
```yaml
backend:
  name: github
  repo: rickhallett/becoming-diamond-nextjs
  branch: staging
  base_url: https://staging.becomingdiamond.com
  auth_endpoint: /api/cms-auth
```

#### Task 4.3: OAuth Testing
**Duration:** 30 minutes

**Actions:**
- [ ] Test Google login on staging
- [ ] Test magic link email on staging
- [ ] Verify session persistence
- [ ] Test logout functionality
- [ ] Test OAuth error handling

---

### Phase 5: Database Configuration (1 hour)

**Objective:** Set up separate databases or shared database with environment awareness

#### Task 5.1: Database Strategy Decision
**Duration:** 15 minutes

**Decision Required:**
- **Option A:** Shared database for staging/production (simpler, lower cost)
- **Option B:** Separate staging database (safer, higher isolation)

**Recommendation:** Option A for MVP, migrate to Option B later if needed

#### Task 5.2: Turso Database Setup
**Duration:** 30 minutes

**Actions (if separate databases):**
- [ ] Create staging database in Turso
- [ ] Run migrations on staging database
- [ ] Configure staging environment variables
- [ ] Test database connectivity
- [ ] Seed staging data (if needed)

**Actions (if shared database):**
- [ ] Add environment tracking to user records (optional)
- [ ] Document data separation strategy
- [ ] Set up database backups
- [ ] Configure read replicas (if needed)

#### Task 5.3: Migration Testing
**Duration:** 15 minutes

**Actions:**
- [ ] Test `npm run db:migrate` on staging
- [ ] Verify schema matches production
- [ ] Test TursoAdapter authentication
- [ ] Verify session storage
- [ ] Test user creation flow

---

### Phase 6: Testing and Validation (2-3 hours)

**Objective:** Comprehensive testing of staging environment before production deployment

#### Task 6.1: Functional Testing
**Duration:** 1 hour

**Test Cases:**
- [ ] Landing page loads correctly
- [ ] Blog posts render with correct styling
- [ ] Member authentication (Google OAuth)
- [ ] Magic link email delivery
- [ ] Session persistence across pages
- [ ] Profile page updates
- [ ] Sprint progress tracking
- [ ] Video playback with token auth
- [ ] Admin lead management
- [ ] Stripe checkout flow (test mode)
- [ ] Decap CMS login and editing

**Documentation:** Create test case checklist with pass/fail status

#### Task 6.2: Build and Deployment Testing
**Duration:** 1 hour

**Actions:**
- [ ] Test build from clean state
- [ ] Verify deployment logs in Vercel
- [ ] Check for build warnings
- [ ] Verify all environment variables loaded
- [ ] Test edge functions (middleware)
- [ ] Check serverless function timeouts
- [ ] Verify static asset serving
- [ ] Test image optimization

#### Task 6.3: Performance and Monitoring
**Duration:** 1 hour

**Actions:**
- [ ] Run Lighthouse audit on staging
- [ ] Verify Axiom logging works
- [ ] Test error logging to Axiom
- [ ] Check Chrome DevTools network tab
- [ ] Verify Core Web Vitals
- [ ] Test mobile responsiveness
- [ ] Check accessibility scores

**Performance Targets:**
- Lighthouse Performance: >90
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.5s

---

### Phase 7: Documentation and Training (1-2 hours)

**Objective:** Create comprehensive documentation and train team

#### Task 7.1: Developer Documentation
**Duration:** 1 hour

**Deliverables:**
- [ ] Deployment workflow guide
- [ ] Environment variable reference
- [ ] Branch strategy documentation
- [ ] Rollback procedures
- [ ] Troubleshooting guide
- [ ] Emergency contacts and escalation

**Document Location:** `docs/deployment/` directory

#### Task 7.2: Team Training
**Duration:** 1 hour

**Training Topics:**
1. New deployment workflow (staging → production)
2. How to deploy to staging
3. How to test on staging environment
4. How to promote staging to production
5. Emergency rollback procedures
6. Monitoring and logging access

**Format:** Live session with screen sharing + recorded video

**Materials:**
- Training slide deck
- Screen recording
- Quick reference card
- FAQ document

---

## Risk Management

### Identified Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Build fails on Vercel | Medium | High | Test builds locally first, verify vercel.json config |
| OAuth redirect issues | Medium | High | Test all redirect URIs, use Chrome DevTools MCP |
| Environment variable mismatch | Low | High | Use templates, verify before deployment |
| DNS propagation delays | Low | Medium | Configure DNS early, wait 24-48 hours if needed |
| Database migration issues | Low | High | Test migrations on staging first, keep backups |
| Dependency conflicts | Medium | Medium | Use --legacy-peer-deps, lock package versions |

### Rollback Plan

**If staging deployment fails:**
1. Check Vercel deployment logs
2. Review build errors
3. Fix issues locally
4. Push fix to staging branch
5. Automatic re-deployment

**If production deployment fails:**
1. Immediate rollback via Vercel dashboard (instant)
2. Alternative: Redeploy previous commit from `main`
3. Investigate issue on staging
4. Fix and re-test on staging
5. Re-deploy to production when validated

---

## Success Criteria

### Phase Completion Criteria

**Phase 1 Complete:**
- [ ] Build succeeds without errors
- [ ] All environment variables documented
- [ ] ESLint and Knip configured correctly
- [ ] Dependencies install without issues

**Phase 2 Complete:**
- [ ] Vercel Pro account active and billed to client
- [ ] Staging environment deployed and accessible
- [ ] Custom domain staging.becomingdiamond.com working
- [ ] SSL certificates valid

**Phase 3 Complete:**
- [ ] Staging branch created and protected
- [ ] Automatic deployments working
- [ ] Git workflow documented

**Phase 4 Complete:**
- [ ] Staging OAuth apps configured
- [ ] All OAuth flows tested and working
- [ ] CMS accessible on staging

**Phase 5 Complete:**
- [ ] Database strategy implemented
- [ ] Migrations tested
- [ ] Data isolation verified (if applicable)

**Phase 6 Complete:**
- [ ] All test cases passed
- [ ] Performance targets met
- [ ] Logging and monitoring verified

**Phase 7 Complete:**
- [ ] Documentation published
- [ ] Team trained
- [ ] Handoff complete

### Overall Success Criteria

**Must Have (Blocking):**
1. Staging environment fully functional at staging.becomingdiamond.com
2. Automatic deployment from staging branch working
3. All authentication flows working (Google OAuth, magic link)
4. Zero build errors or critical warnings
5. Production environment unchanged and stable

**Should Have (Important but not blocking):**
1. Lighthouse score >90
2. All test cases passing
3. Complete documentation
4. Team training completed

**Nice to Have (Future enhancements):**
1. Automated testing in CI/CD
2. Deployment notifications to Slack
3. Automated database backups
4. Preview deployments for feature branches

---

## Timeline and Milestones

### Day 1: Technical Foundation

**Morning (4 hours):**
- 08:00-10:00: Phase 1.1-1.2 (Build system + environment variables)
- 10:00-12:00: Phase 1.3-1.4 (Code quality + dependencies)

**Afternoon (4 hours):**
- 13:00-16:00: Phase 2.1-2.3 (Vercel setup + config + env vars)
- 16:00-17:00: Phase 2.4 (Custom domain)

**Milestone 1:** Technical issues resolved, Vercel infrastructure configured

### Day 2: Integration and Testing

**Morning (4 hours):**
- 08:00-09:00: Phase 3 (Git workflow)
- 09:00-11:00: Phase 4 (OAuth configuration)
- 11:00-12:00: Phase 5 (Database setup)

**Afternoon (4 hours):**
- 13:00-16:00: Phase 6 (Testing and validation)
- 16:00-18:00: Phase 7 (Documentation and training)

**Milestone 2:** Staging environment fully tested and team trained

### Buffer Time
- Additional 4 hours available for unexpected issues
- Can extend to 16 hours total (2 full days) if needed

---

## Resource Requirements

### Tools and Access

**Required Access:**
- [ ] GitHub repository (admin)
- [ ] Vercel account (owner)
- [ ] Google Cloud Console (OAuth apps)
- [ ] Turso dashboard (database)
- [ ] Domain registrar (DNS)
- [ ] Axiom dashboard (logging)
- [ ] Stripe dashboard (test/live mode)

**Required Tools:**
- [ ] Node.js 18+
- [ ] Git
- [ ] Code editor (VS Code recommended)
- [ ] Chrome browser with DevTools
- [ ] Terminal access

### Team Involvement

**Required Availability:**
- **Developer:** 12-16 hours over 2 days
- **Project Manager:** 1 hour for kickoff, 1 hour for review
- **Client/Stakeholder:** 1 hour for training session

### Budget Allocation

**Development Time:**
- Phase 1: 4-6 hours ($160-240)
- Phase 2: 2-3 hours (included)
- Phase 3: 1 hour (included)
- Phase 4: 1-2 hours (included)
- Phase 5: 1 hour (included)
- Phase 6: 2-3 hours (included)
- Phase 7: 1-2 hours (included)

**Total Development:** $180-260 (includes buffer)

**Infrastructure (first month):**
- Vercel Pro: $20 (reimbursed in first invoice)

**Total First Invoice:** $260-340

---

## Post-Implementation

### Monitoring (First Week)

**Daily Checks:**
- [ ] Review Vercel deployment logs
- [ ] Check Axiom for errors
- [ ] Monitor uptime
- [ ] Review user feedback

**Weekly Checks:**
- [ ] Performance metrics review
- [ ] Cost analysis (Vercel billing)
- [ ] Database growth monitoring
- [ ] Security audit

### Maintenance Plan

**Monthly:**
- Review and update dependencies
- Check for security updates
- Review Axiom logs for patterns
- Optimize performance if needed

**Quarterly:**
- Full security audit
- Performance optimization review
- Cost optimization review
- Documentation updates

### Support Period

**First 30 Days:**
- Developer available for critical issues
- Response time: 4 hours
- Included in implementation cost

**After 30 Days:**
- Standard support rates apply
- Option to upgrade to Option C (automated testing) for $160-240

---

## Appendix

### A. Command Reference

**Local Development:**
```bash
npm run dev                    # Start dev server (port 3003)
npm run build                  # Production build
npm run lint                   # Run ESLint
npm run test                   # Run all tests
npm run db:migrate            # Run database migrations
```

**Deployment:**
```bash
git checkout staging           # Switch to staging branch
git pull origin main          # Get latest from main
# Make changes
git commit -m "feat: description"
git push origin staging       # Auto-deploys to staging

# After testing on staging:
git checkout main
git merge staging             # Or create PR
git push origin main          # Auto-deploys to production
```

**Emergency Rollback:**
```bash
# Via Vercel CLI
vercel rollback [deployment-url]

# Via Git
git revert [commit-hash]
git push origin main
```

### B. Environment Variable Template

See `docs/deployment/environment-variables.md` (to be created)

### C. Troubleshooting Guide

**Build fails with "Cannot find module":**
- Delete `node_modules` and `.next`
- Run `npm install --legacy-peer-deps`
- Rebuild

**OAuth redirect loop:**
- Verify `NEXTAUTH_URL` matches exact domain
- Check redirect URIs in Google Console
- Use Chrome DevTools MCP to inspect cookies
- Review Axiom logs for auth errors

**Staging not deploying:**
- Check Vercel deployment logs
- Verify branch protection rules
- Check environment variable scopes
- Test build locally first

### D. Contact Information

**Technical Issues:**
- Developer: [contact info]
- Vercel Support: https://vercel.com/support

**Service Providers:**
- Vercel Dashboard: https://vercel.com/dashboard
- Turso Dashboard: https://turso.tech
- Axiom Dashboard: https://app.axiom.co
- Google Cloud Console: https://console.cloud.google.com

---

## Document Control

**Version:** 1.0
**Created:** 2025-12-28
**Last Updated:** 2025-12-28
**Next Review:** After implementation completion
**Owner:** Development Team
**Approved By:** [Pending]

**Change Log:**
- 2025-12-28: Initial version created
- [Future updates here]

---

## Approval

**To proceed with implementation:**

[ ] Budget approved: $260-340 first invoice + $21/month ongoing
[ ] Timeline approved: 1-2 days implementation
[ ] Resources committed: Developer time, access credentials
[ ] Vercel billing information provided
[ ] Training session scheduled

**Approved By:** ___________________________  **Date:** ___________

**Implementation Start Date:** ___________________________

---

**End of Implementation Plan**
