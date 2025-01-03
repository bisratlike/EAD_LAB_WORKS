
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/")
public class DispatcherServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");

        if ("add".equalsIgnoreCase(action)) {
            request.getRequestDispatcher("/registerBook").forward(request, response);
        } else if ("view".equalsIgnoreCase(action)) {
            request.getRequestDispatcher("/displayBooks").forward(request, response);
        } else if ("delete".equalsIgnoreCase(action)) {
            request.getRequestDispatcher("/deleteBook").forward(request, response);
        } else {
            response.getWriter().println("Invalid action!");
        }
    }
}