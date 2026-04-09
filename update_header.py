import re

with open('frontend/src/components/Header.jsx', 'r') as f:
    content = f.read()

# Extract array
navLinks_match = re.search(r'  const navLinks = \[(.*?)\];', content, re.DOTALL)

if not navLinks_match:
    print("Failed to match navLinks array")
    exit(1)

# Format the extracted array to be outside the component
static_array = f"""const navLinks = [{navLinks_match.group(1)}];
"""

# Remove the array from inside the component
content = content.replace(f'  const navLinks = [{navLinks_match.group(1)}];\n\n', '')

# Insert the array before the Header component definition
content = content.replace('const Header = () => {', f'{static_array}\nconst Header = () => {{')

with open('frontend/src/components/Header.jsx', 'w') as f:
    f.write(content)

print("Updated Header.jsx")
