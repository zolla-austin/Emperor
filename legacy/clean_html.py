input_path = r"c:\Users\iduh cletus austine\OneDrive\Desktop\Emperor\index.html"
output_path = r"c:\Users\iduh cletus austine\OneDrive\Desktop\Emperor\index_clean.html"

with open(input_path, "r", encoding="utf-8") as f_in:
    with open(output_path, "w", encoding="utf-8") as f_out:
        for line in f_in:
            if 'src="data:image/' in line:
                start_idx = line.find('src="data:image/')
                if start_idx != -1:
                    comma_idx = line.find(';base64,', start_idx)
                    if comma_idx != -1:
                        end_quote_idx = line.find('"', comma_idx + 8)
                        if end_quote_idx != -1:
                            line = line[:comma_idx + 8] + "[BASE64_PLACEHOLDER]" + line[end_quote_idx:]
            f_out.write(line)

print("Cleaned HTML created successfully at index_clean.html")
