import java.util.Calendar;

import org.quartz.CronExpression;

public class ValidaExpresion
{
	public static void main(String[] args) throws Exception
	{
		String s = "* * 8/1 ? 4 2,4 ";
		CronExpression exp = new CronExpression(s);
		
		Calendar cal = Calendar.getInstance();
		cal.set(2016, 4, 4, 8, 0);
		System.out.println(cal.getTime() + "**" + exp.isSatisfiedBy(cal.getTime()) 
		+ "**" + exp.getNextValidTimeAfter(cal.getTime()) 
		+ "**"+ exp.getNextInvalidTimeAfter(cal.getTime())
		+ "**"+ exp.getExpressionSummary()
		);
	}
}
