import re

with open('frontend/src/pages/HomePage.jsx', 'r') as f:
    content = f.read()

# Extract arrays
projects_match = re.search(r'  const projects = \[(.*?)\];', content, re.DOTALL)
bonuses_match = re.search(r'  const bonuses = \[(.*?)\];', content, re.DOTALL)
whatsIncluded_match = re.search(r'  const whatsIncluded = \[(.*?)\];', content, re.DOTALL)
whyPerfect_match = re.search(r'  const whyPerfect = \[(.*?)\];', content, re.DOTALL)
faqs_match = re.search(r'  const faqs = \[(.*?)\];', content, re.DOTALL)

if not (projects_match and bonuses_match and whatsIncluded_match and whyPerfect_match and faqs_match):
    print("Failed to match all arrays")
    exit(1)

# Format the extracted arrays to be outside the component
static_arrays = f"""const projects = [{projects_match.group(1)}];

const bonuses = [{bonuses_match.group(1)}];

const whatsIncluded = [{whatsIncluded_match.group(1)}];

const whyPerfect = [{whyPerfect_match.group(1)}];

const faqs = [{faqs_match.group(1)}];
"""

# Remove the arrays from inside the component
content = content.replace(f'  const projects = [{projects_match.group(1)}];\n\n', '')
content = content.replace(f'  const bonuses = [{bonuses_match.group(1)}];\n\n', '')
content = content.replace(f'  const whatsIncluded = [{whatsIncluded_match.group(1)}];\n\n', '')
content = content.replace(f'  const whyPerfect = [{whyPerfect_match.group(1)}];\n\n', '')
content = content.replace(f'  const faqs = [{faqs_match.group(1)}];\n\n', '')

# Insert the arrays before the HomePage component definition
content = content.replace('const HomePage = () => {', f'{static_arrays}\nconst HomePage = () => {{')

with open('frontend/src/pages/HomePage.jsx', 'w') as f:
    f.write(content)

print("Updated HomePage.jsx")
