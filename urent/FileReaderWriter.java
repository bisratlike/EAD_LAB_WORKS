import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FileReaderWriter {

    // Define the directory to read files from
    private static final String DIRECTORY_PATH = "./src/main/java"; // Replace with your actual folder

    // Define the output file path
    private static final String OUTPUT_FILE_PATH = "output.txt";

    // Function to read files recursively from directories
    private static String readFilesRecursively(File directory) {
        StringBuilder content = new StringBuilder();

        try {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        content.append("\n--- Entering directory: ").append(file.getAbsolutePath()).append(" ---\n");
                        content.append(readFilesRecursively(file));
                    } else if (file.isFile()) {
                        content.append("\n--- Content of ").append(file.getAbsolutePath()).append(" ---\n");
                        content.append(new String(Files.readAllBytes(file.toPath()))).append("\n");
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading file or directory: " + directory.getAbsolutePath());
            e.printStackTrace();
        }

        return content.toString();
    }

    // Function to write content to a file
    private static void writeContentToFile(String outputPath, String content) {
        try (FileWriter writer = new FileWriter(outputPath)) {
            writer.write(content);
            System.out.println("Contents written to " + outputPath);
        } catch (IOException e) {
            System.err.println("Error writing to file: " + outputPath);
            e.printStackTrace();
        }
    }

    // Main function
    public static void main(String[] args) {
        File directory = new File(DIRECTORY_PATH);
        if (!directory.exists() || !directory.isDirectory()) {
            System.err.println("Invalid directory path: " + DIRECTORY_PATH);
            return;
        }

        String content = readFilesRecursively(directory);
        writeContentToFile(OUTPUT_FILE_PATH, content);
    }
}