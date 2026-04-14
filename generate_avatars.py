import base64

def make_avatar_svg(name, skin, skin_shadow, hair, hair_style, shirt, shirt2, eye_color, has_beard=False, gender='m', bg='#f2f1ee'):
    """Generate a modern minimalist portrait SVG"""
    
    # Different hair styles
    hair_paths = {
        'short_left': '''
            <ellipse cx="128" cy="82" rx="52" ry="28" fill="{hair}"/>
            <path d="M78,90 Q76,70 88,55 Q105,40 128,38 Q155,42 168,58 Q178,72 176,90" fill="{hair}"/>
            <path d="M78,90 Q76,82 80,75 L82,92Z" fill="{hair}"/>
        ''',
        'short_neat': '''
            <path d="M78,95 Q76,68 95,52 Q112,40 128,38 Q148,40 162,52 Q180,68 178,95 L178,85 Q175,62 158,50 Q140,40 128,40 Q116,40 98,50 Q82,62 78,85Z" fill="{hair}"/>
        ''',
        'female_long': '''
            <path d="M75,95 Q73,65 92,48 Q112,35 128,33 Q148,35 165,48 Q183,65 181,95" fill="{hair}"/>
            <path d="M75,95 Q72,120 74,150 Q76,165 82,170 L78,95Z" fill="{hair}"/>
            <path d="M181,95 Q184,120 182,150 Q180,165 174,170 L178,95Z" fill="{hair}"/>
        ''',
        'buzz': '''
            <path d="M80,98 Q78,72 96,56 Q112,44 128,42 Q148,44 162,56 Q180,72 178,98 L175,90 Q172,68 158,55 Q142,44 128,44 Q114,44 98,55 Q84,68 82,90Z" fill="{hair}"/>
        '''
    }
    
    beard_svg = ''
    if has_beard:
        beard_svg = f'''
            <path d="M104,145 Q108,162 118,170 Q126,175 128,175 Q130,175 138,170 Q148,162 152,145 Q150,155 140,165 Q132,172 128,172 Q124,172 116,165 Q106,155 104,145Z" fill="{hair}" opacity="0.5"/>
            <path d="M98,135 Q96,148 102,160 Q108,168 115,172" fill="none" stroke="{hair}" stroke-width="1.5" opacity="0.3"/>
            <path d="M158,135 Q160,148 154,160 Q148,168 141,172" fill="none" stroke="{hair}" stroke-width="1.5" opacity="0.3"/>
        '''
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 280" width="256" height="280">
  <defs>
    <clipPath id="circle-{name}">
      <circle cx="128" cy="140" r="120"/>
    </clipPath>
    <linearGradient id="skin-{name}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{skin}"/>
      <stop offset="100%" stop-color="{skin_shadow}"/>
    </linearGradient>
    <linearGradient id="shirt-{name}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{shirt}"/>
      <stop offset="100%" stop-color="{shirt2}"/>
    </linearGradient>
  </defs>
  <g clip-path="url(#circle-{name})">
    <!-- Background -->
    <rect width="256" height="280" fill="{bg}"/>
    
    <!-- Body / Shoulders -->
    <ellipse cx="128" cy="260" rx="90" ry="60" fill="url(#shirt-{name})"/>
    
    <!-- Neck -->
    <rect x="114" y="160" width="28" height="30" rx="8" fill="url(#skin-{name})"/>
    
    <!-- Collar -->
    <path d="M108,185 L128,205 L148,185" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.6"/>
    
    <!-- Head -->
    <ellipse cx="128" cy="115" rx="50" ry="55" fill="url(#skin-{name})"/>
    
    <!-- Ears -->
    <ellipse cx="79" cy="118" rx="8" ry="12" fill="{skin_shadow}"/>
    <ellipse cx="177" cy="118" rx="8" ry="12" fill="{skin_shadow}"/>
    
    <!-- Hair -->
    {hair_paths.get(hair_style, hair_paths['short_neat']).format(hair=hair)}
    
    <!-- Eyes -->
    <ellipse cx="110" cy="115" rx="7" ry="5" fill="#ffffff"/>
    <ellipse cx="146" cy="115" rx="7" ry="5" fill="#ffffff"/>
    <circle cx="111" cy="115" r="3.5" fill="{eye_color}"/>
    <circle cx="147" cy="115" r="3.5" fill="{eye_color}"/>
    <circle cx="111.5" cy="114.5" r="1.8" fill="#1a1a1a"/>
    <circle cx="147.5" cy="114.5" r="1.8" fill="#1a1a1a"/>
    <!-- Eye highlights -->
    <circle cx="112.5" cy="113.5" r="0.8" fill="#ffffff" opacity="0.8"/>
    <circle cx="148.5" cy="113.5" r="0.8" fill="#ffffff" opacity="0.8"/>
    
    <!-- Eyebrows -->
    <path d="M100,106 Q110,102 120,105" fill="none" stroke="{hair}" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>
    <path d="M136,105 Q146,102 156,106" fill="none" stroke="{hair}" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>
    
    <!-- Nose -->
    <path d="M128,118 Q125,130 122,133 Q126,136 128,136 Q130,136 134,133 Q131,130 128,118" fill="{skin_shadow}" opacity="0.4"/>
    
    <!-- Mouth (slight smile) -->
    <path d="M116,145 Q122,152 128,152 Q134,152 140,145" fill="none" stroke="{skin_shadow}" stroke-width="2" stroke-linecap="round"/>
    
    <!-- Beard -->
    {beard_svg}
  </g>
</svg>'''
    return svg


# Marcus Reynolds - VP Sales, confident, medium skin, dark hair, beard
marcus_svg = make_avatar_svg(
    name='marcus',
    skin='#d4a574', skin_shadow='#c49464',
    hair='#2c1810', hair_style='short_left',
    shirt='#2c3e50', shirt2='#1a252f',
    eye_color='#4a6741',
    has_beard=True, gender='m'
)

# Sarah Chen - Founder/CEO, East Asian, dark hair, professional  
sarah_svg = make_avatar_svg(
    name='sarah',
    skin='#f0d0b0', skin_shadow='#e0c0a0',
    hair='#1a1209', hair_style='female_long',
    shirt='#7cc5a2', shirt2='#5ba882',
    eye_color='#3d2b1f',
    has_beard=False, gender='f'
)

# David Okafor - Head of Growth, darker skin, buzz cut
david_svg = make_avatar_svg(
    name='david',
    skin='#8d6e4c', skin_shadow='#7d5e3c',
    hair='#1a1209', hair_style='buzz',
    shirt='#7BAFD4', shirt2='#5b8fb4',
    eye_color='#3d2b1f',
    has_beard=False, gender='m'
)

# Save as SVG files
for name, svg in [('marcus', marcus_svg), ('sarah', sarah_svg), ('david', david_svg)]:
    with open(f'review-{name}.svg', 'w') as f:
        f.write(svg)

# Also create base64 encoded versions for inline use
for name, svg in [('marcus', marcus_svg), ('sarah', sarah_svg), ('david', david_svg)]:
    b64 = base64.b64encode(svg.encode()).decode()
    print(f"review-{name}.svg: data:image/svg+xml;base64,{b64[:50]}...")

print("\nAll SVG avatars generated!")
