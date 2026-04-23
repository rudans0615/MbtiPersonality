import paramiko

print("Connecting with paramiko...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('144.24.87.131', username='ubuntu', key_filename=r'C:\Blog\ssh-key-2026-03-03.key')

print("Executing command...")
stdin, stdout, stderr = client.exec_command('cd ~/MbtiPersonality && git fetch origin && git checkout main && git reset --hard origin/main && cd scripts/cms-bot && pm2 restart mbti-cms-bot')
print("STDOUT:", stdout.read().decode('utf-8'))
print("STDERR:", stderr.read().decode('utf-8'))

client.close()
print("Done!")
