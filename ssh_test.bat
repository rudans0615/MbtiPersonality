cd C:\Blog
ssh -T -i "ssh-key-2026-03-03.key" -o StrictHostKeyChecking=no ubuntu@144.24.87.131 "cd ~/MbtiPersonality && git fetch origin && git checkout main && git reset --hard origin/main && cd scripts/cms-bot && pm2 restart mbti-cms-bot" < NUL
