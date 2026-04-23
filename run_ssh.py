import subprocess

cmd = [
    'ssh', '-i', r'C:\Blog\ssh-key-2026-03-03.key',
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'BatchMode=yes',
    'ubuntu@144.24.87.131',
    'killall git || true; rm -f ~/MbtiPersonality/.git/index.lock; cd ~/MbtiPersonality && git fetch origin && git reset --hard origin/main && cd scripts/cms-bot && pm2 restart mbti-cms-bot'
]

print("Running ssh command...")
try:
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
    print("RETURN CODE:", result.returncode)
except subprocess.TimeoutExpired as e:
    print("Timeout:", e)
except Exception as e:
    print("Error:", e)
