NETLIFY_SITE_ID = e62d7400-de29-4da9-a919-30e35fdb3f24

.PHONY: build deploy

# CSS 빌드 (CDN 없이 로컬 Tailwind)
build:
	node build.mjs

# dcode-labs.com 배포 (빌드 후 netlify CLI 업로드)
deploy: build
	netlify deploy --prod --dir . --site $(NETLIFY_SITE_ID)
