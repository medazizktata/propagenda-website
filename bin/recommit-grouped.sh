#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ "$(git rev-list --count HEAD 2>/dev/null || echo 0)" -gt 0 ]]; then
  echo "Removing existing commits (files stay on disk)..."
  git update-ref -d HEAD
  git reset
fi

commit() {
  git commit -m "$1"
}

git add .gitignore .npmrc pnpm-workspace.yaml package.json pnpm-lock.yaml \
  eslint.config.mjs tsconfig.json next.config.ts postcss.config.mjs \
  tailwind.config.ts next-env.d.ts .env.example README.md
commit "chore: add project config and tooling"

git add app/globals.css styles/photoswipe.css
commit "feat: add design tokens and global styles"

git add types/ content/
commit "feat: add content modules and types"

git add lib/constants/ lib/utils/ lib/content/ lib/forms/
commit "feat: add lib utilities and form handling"

git add lib/motion/ lib/seo/ hooks/
commit "feat: add motion system and seo helpers"

git add components/ui/ components/molecules/ lib/utils/cn.ts
commit "feat: add ui atoms and molecules"

git add components/layout/ app/layout.tsx app/providers.tsx components/seo/
commit "feat: add layout shell and providers"

git add components/sections/ContactForm.tsx components/sections/ContactInfoBlock.tsx \
  components/sections/ContactSection.tsx components/molecules/ContactInfoRow.tsx \
  components/molecules/FormField.tsx msw/ app/api/
commit "feat: add contact form and msw dev mock"

git add components/sections/Hero.tsx components/sections/ManifestoSection.tsx \
  components/sections/DesignPrintInstallPopup.tsx components/sections/MethodologySection.tsx \
  components/sections/WorkSplitSection.tsx components/sections/ClientLogoGrid.tsx \
  components/sections/BlogTeaserGrid.tsx components/sections/BlogCard.tsx \
  components/sections/ContactSection.tsx components/templates/HomePageContent.tsx \
  app/page.tsx content/home.ts
commit "feat: add homepage sections"

git add components/sections/About*.tsx components/sections/LeadershipCard.tsx \
  components/templates/AboutPageContent.tsx app/about/ content/about.ts
commit "feat: add about page"

git add components/ServiceCard.tsx components/sections/ServiceGrid.tsx \
  components/sections/PageHero.tsx components/sections/DesignPrintInstallStrip.tsx \
  components/templates/ServicesPageContent.tsx app/services/page.tsx \
  content/servicesHub.ts lib/content/getServiceHubCards.ts
commit "feat: add services hub"

git add components/sections/ProjectFixedHeader.tsx components/sections/DetailOverview.tsx \
  components/sections/ProjectGallery.tsx components/PhotoSwipeLightbox.tsx \
  components/GalleryThumbnail.tsx components/TierTable.tsx components/EventChecklist.tsx \
  components/ExtendedBulletList.tsx components/templates/ServiceDetailContent.tsx \
  app/services/\[slug\]/ hooks/usePhotoSwipe.ts content/services/index.ts
commit "feat: add service detail template"

git add components/sections/WorkCard.tsx components/sections/WorkOverviewList.tsx \
  components/sections/LogoWallGrid.tsx components/sections/ClosingCTABand.tsx \
  components/templates/WorkPageContent.tsx app/work/page.tsx content/workHub.ts
commit "feat: add work hub"

git add components/PrevNextLink.tsx components/sections/ProjectPrevNext.tsx \
  components/templates/CaseStudyDetailContent.tsx app/work/\[slug\]/ \
  content/work/index.ts lib/content/getCaseStudyNav.ts lib/content/getCaseStudy.ts \
  lib/content/getAllSlugs.ts
commit "feat: add case study pages"

git add components/ArrowCTA.tsx components/sections/ContactSplitHero.tsx \
  components/templates/ContactPageContent.tsx app/contact/ content/contact.ts
commit "feat: add contact page"

git add components/sections/LegalPageContent.tsx content/legal/ app/privacy/ app/terms/ app/imprint/
commit "feat: add legal pages"

git add lib/constants/redirects.ts app/sitemap.ts app/robots.ts lib/seo/
commit "feat: add seo redirects and structured data"

git add components/sections/CTABand.tsx components/StubPage.tsx \
  components/layout/Footer.tsx components/layout/Header.tsx components/layout/MobileMenu.tsx \
  components/molecules/RunningMarquee.tsx components/molecules/SocialIconLink.tsx \
  components/molecules/HamburgerButton.tsx components/molecules/HeaderCTA.tsx \
  components/molecules/NavItem.tsx content/site.ts content/index.ts content/blog/ \
  lib/content/navigation.ts lib/content/getBlogPost.ts lib/content/getService.ts \
  app/blog/ public/
commit "feat: add shared chrome blog stubs and assets"

if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  commit "chore: add remaining site files"
fi

echo "Done. $(git rev-list --count HEAD) commits on $(git branch --show-current)."
