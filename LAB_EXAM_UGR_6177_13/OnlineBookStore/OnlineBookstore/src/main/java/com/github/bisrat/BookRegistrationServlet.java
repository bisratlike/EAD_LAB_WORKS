
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

@WebServlet("/registerBook")
public class BookRegistrationServlet extends HttpServlet {
    private DBConnectionManager dbManager = new DBConnectionManager();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String title = request.getParameter("title");
        String author = request.getParameter("author");
        Double price = request.getParameter("price");

        try (Connection connection = dbManager.openConnection()) {
            String query = "INSERT INTO Books(title, author, price) VALUES (?, ?, 1)";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, title);
            preparedStatement.setString(2, author);
            preparedStatement.setInt(3, price);

            preparedStatement.executeUpdate();

            PrintWriter out = response.getWriter();
            out.println("book registered successfully!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}