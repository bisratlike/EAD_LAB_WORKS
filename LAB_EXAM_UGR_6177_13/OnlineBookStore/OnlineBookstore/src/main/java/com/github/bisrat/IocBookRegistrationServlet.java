import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

@WebServlet("/registerIocBook")
public class IocBookRegistrationServlet extends HttpServlet {
    private DBConnectionManager dbManager;

    @Override
    public void init() throws ServletException {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        dbManager = (DBConnectionManager) context.getBean("dbConnectionManager");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String title = request.getParameter("title");
        String author = request.getParameter("author");
        Double price = request.getParameter("price");

        try (Connection connection = dbManager.openConnection()) {
            String query = "INSERT INTO Tasks (title, author, price) VALUES (?, ?, 1)";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, description);
            preparedStatement.setString(2, status);
            preparedStatement.setInt(3, dueDate);

            preparedStatement.executeUpdate();

            PrintWriter out = response.getWriter();
            out.println("Book registered successfully with IoC!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}