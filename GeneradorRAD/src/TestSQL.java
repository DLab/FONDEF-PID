import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TestSQL
{
	public static void main1(String[] args) throws Exception
	{
		Class.forName("com.mysql.jdbc.Driver");
//		return DriverManager.getConnection("jdbc:mysql://localhost/afoit?useUnicode=true&amp;characterEncoding=UTF-8", "root", "JHTi2990");
		Connection con = DriverManager.getConnection("jdbc:mysql://afoit/afoit?useUnicode=true&amp;characterEncoding=UTF-8", "afoit", "afoit");
		try
		{
			SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			CallableStatement stmt = con.prepareCall("{ call proc_reglanegocio_consulta(?, ?, ?, ?, ?, ?, ?, ?, ?) }");
			stmt.setString(1, fmt.format(new Date()));
			stmt.setString(2, "CTACTE000");
			stmt.setString(3, "SUC090");
			stmt.setString(4, "118526902");
			stmt.setInt(5, 4);
			stmt.setInt(6, 0);
			stmt.setInt(7, 85);
			stmt.setString(8, "ACTI");
			stmt.setInt(9, 101);
			ResultSet rset = stmt.executeQuery();
			System.out.println("antes..."+ fmt.format(new Date()));
			while(rset.next())
			{
				System.out.println(rset.getString(1));
			}
			System.out.println("despues");
			rset.close();
			stmt.close();
		}
		finally
		{
			con.close();
		}
		
	}
	public static void main(String[] args) throws Exception
	{
		Class.forName("org.mariadb.jdbc.Driver");
		Connection connection = DriverManager.getConnection("jdbc:mariadb://localhost:3306/sisgic?user=sisgic&password=s1sg1c");
		try
		{
			PreparedStatement stmt = connection.prepareStatement("select * from tipotexto");
			ResultSet rset = stmt.executeQuery();
			while(rset.next())
			{
				System.out.println(rset.getString(2));
			}
			stmt.close();
		}
		finally
		{
			connection.close();
		}
		
	}
}
