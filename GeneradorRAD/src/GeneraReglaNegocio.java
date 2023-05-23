import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class GeneraReglaNegocio
{
	protected static Connection newConnection() throws Exception
	{
		Class.forName("com.mysql.jdbc.Driver");
		Connection con = DriverManager.getConnection("jdbc:mysql://localhost/afoit?useUnicode=true&amp;characterEncoding=UTF-8", "root", "");
		con.setAutoCommit(false);
		return con;
	}
	
	public static void main(String[] args) throws Exception
	{
		String sql = "insert into regla_negocio (rdn_codigo, rdn_inicio, rdn_est_codigo, rdn_descripcion, rdn_usuario, rdn_timestamp, rdn_expvigencia, rdn_expcondicion) values (?, now(), 'ACTI', ?, 'ADMIN', now(), ?, ?)";
		Connection con = newConnection();
		PreparedStatement stmt = con.prepareStatement(sql);
		for (int i = 0; i < 1000; i++)
		{
			stmt.setString(1, "TESTX1-" + i);
			stmt.setString(2, "TESTX1 descripcion " + i);
			stmt.setString(3, "[]");
			stmt.setString(4, "[]");
			stmt.executeUpdate();
			con.commit();
			System.out.println("insertando:::" + i);
		}
		con.close();
		
	}

}
