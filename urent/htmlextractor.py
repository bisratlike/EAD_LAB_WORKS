import os

def extract_html_files(source_folder, destination_file):
    with open(destination_file, "w", encoding="utf-8") as output_file:
        for root, _, files in os.walk(source_folder):
            for file in files:
                if file.lower().endswith(".html"):
                    source_path = os.path.join(root, file)
                    with open(source_path, "r", encoding="utf-8") as html_file:
                        output_file.write(f"\n<!-- {file} -->\n")
                        output_file.write(html_file.read())
                        output_file.write("\n")
                    print(f"Copied content from: {source_path}")

if __name__ == "__main__":
    source_folder = "./src/main/resources/static/U"
    destination_file = "store/combined.html"
    os.makedirs("store", exist_ok=True)
    extract_html_files(source_folder, destination_file)
    print("Extraction complete. HTML files merged into 'store/combined.html'.")
