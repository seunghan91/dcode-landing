NETLIFY_SITE_ID = e62d7400-de29-4da9-a919-30e35fdb3f24

.PHONY: deploy

# dcode-labs.com 배포 (netlify CLI 직접 배포 - GitHub push와 무관)
deploy:
	netlify deploy --prod --dir . --site $(NETLIFY_SITE_ID)
