import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class GeneraClientes
{

	public static char getDigitoVerificador(int rut)
	{
		int m = 0, s = 1;
		for (; rut != 0; rut /= 10)
		{
			s = (s + rut % 10 * (9 - m++ % 6)) % 11;
		}
		return (char) (s != 0 ? s + 47 : 75);
	}
	public static void main(String[] args) throws Exception
	{
		int from = Integer.parseInt(args[0]);
		int num = Integer.parseInt(args[1]);
		Class.forName("com.mysql.jdbc.Driver");
		Connection con = DriverManager.getConnection("jdbc:mysql://10.0.1.46/afoit?useUnicode=true&amp;characterEncoding=UTF-8", "afoit", "afoit");
		try
		{
			con.setAutoCommit(false);
			
			PreparedStatement stmt = con.prepareStatement("select count(*) from ficha_cliente where fdc_idcliente = ?");
			PreparedStatement ins = con.prepareStatement("insert into ficha_cliente (fdc_idcliente, fdc_rut) values (?, ?)");
			try
			{
				for (int i = 0; i < num; i++)
				{
					int r = from + i;
					String rut = r + String.valueOf(getDigitoVerificador(r));
					stmt.setString(1, rut);
					ResultSet rset = stmt.executeQuery();
					rset.next();
					if (rset.getInt(1) == 0)
					{
						ins.setString(1, rut);
						ins.setString(2, rut);
						ins.executeUpdate();
						if (i % 100 == 0)
						{
							System.out.println("generados:" + i);
							con.commit();
						}
					}
				}
				con.commit();
			}
			finally
			{
				stmt.close();
				ins.close();
			}
		}
		finally
		{
			con.close();
		}
	}
}
