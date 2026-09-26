original_path = r"c:\Users\iduh cletus austine\OneDrive\Desktop\Emperor\index.html"

# Map 1-indexed line numbers to image keys
line_map = {
    249: "img_oba_noir",
    262: "img_imagination",
    275: "img_sovereign_rain",
    290: "img_seduction_royale",
    316: "img_skincare_campaign",
    330: "img_wonder_cream",
    343: "img_cerave_cream",
    356: "img_hydra_aura",
    369: "img_cicaplast",
    382: "img_collagen_snail",
    397: "img_cerave_collection",
    426: "img_emperor_suit",
    435: "img_white_sovereign",
    444: "img_lagos_classic",
    458: "img_oversized_tee",
    467: "img_wings_royalty",
    476: "img_hustle_culture",
    488: "img_flannel_shirt",
    497: "img_signature_hoodie",
    506: "img_monogram_polo",
    531: "img_lookbook_1",
    535: "img_lookbook_2",
    539: "img_lookbook_3",
    543: "img_lookbook_4",
    547: "img_lookbook_5",
    551: "img_lookbook_6",
    555: "img_lookbook_7",
    559: "img_lookbook_8",
    563: "img_lookbook_9"
}

with open(original_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

extracted = {}
for line_num, name in line_map.items():
    line = lines[line_num - 1]
    start = line.find('src="')
    if start != -1:
        end = line.find('"', start + 5)
        if end != -1:
            extracted[name] = line[start+5:end]

with open(r"c:\Users\iduh cletus austine\OneDrive\Desktop\Emperor\images.js", "w", encoding="utf-8") as f_out:
    f_out.write("const EMPEROR_IMAGES = {\n")
    for name, src in extracted.items():
        f_out.write(f"  {name}: '{src}',\n")
    f_out.write("};\n")

print(f"Images extracted successfully! Total images: {len(extracted)}")
