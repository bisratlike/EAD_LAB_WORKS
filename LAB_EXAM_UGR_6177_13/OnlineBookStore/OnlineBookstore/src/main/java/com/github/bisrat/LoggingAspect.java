import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
    @Before("execution(* BookRegistrationServlet.*(..))")
    public void logBeforeMethods() {
        System.out.println("A method in TaskRegistrationServlet is being executed.");
        
    }


}

// <aop:aspectj-autoproxy/>

// <bean id="loggingAspect" class="LoggingAspect"/>