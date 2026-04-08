import subprocess
branches = subprocess.check_output(['git', 'branch', '-r']).decode('utf-8').split('\n')
branches_to_delete = []
for branch in branches:
    branch = branch.strip()
    if not branch or '->' in branch:
        continue
    if branch.startswith('origin/'):
        branch_name = branch[len('origin/'):]
        if branch_name not in ['main', 'gh-pages', 'HEAD']:
            branches_to_delete.append(branch_name)

print("Deleting:", branches_to_delete)
for b in branches_to_delete:
    try:
        subprocess.run(['git', 'push', 'origin', '--delete', b], check=False)
    except Exception as e:
        print(e)
