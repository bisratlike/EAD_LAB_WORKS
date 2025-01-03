import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

@WebServlet("/deleteBook")
public class DeleteBookServlet extends HttpServlet {
    private DBConnectionManager dbManager = new DBConnectionManager();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int id = Integer.parseInt(request.getParameter("id"));

        try (Connection connection = dbManager.openConnection()) {
            String query = "DELETE FROM Books WHERE id = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setInt(1, id);

            preparedStatement.executeUpdate();

            response.getWriter().println("Task deleted successfully!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}