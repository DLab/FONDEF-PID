import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class CallStoreProcedure
{
	public static void main(String[] args) throws Exception
	{
		Class.forName("com.mysql.jdbc.Driver");
		Connection con = DriverManager.getConnection("jdbc:mysql://localhost/afoit?useUnicode=true&amp;characterEncoding=UTF-8", "root", "");
		
		try
		{
			PreparedStatement stmt = con.prepareStatement("select now()");
			ResultSet rset = stmt.executeQuery();
			rset.next();
			System.out.println(rset.getDate(1));
			rset.close();
			stmt.close();
			
			CallableStatement call = con.prepareCall("call proc_test(?)");
			call.setString(1, "Test");
			rset = call.executeQuery();
			rset.next();
			
			System.out.println(rset.getDate(1) + ", columna 2:" + rset.getString(2));
			
			rset.close();
			call.close();
			
		}
		finally
		{
			con.close();
		}
	}
}	
