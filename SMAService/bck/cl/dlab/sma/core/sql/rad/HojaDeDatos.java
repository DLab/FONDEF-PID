package cl.dlab.sma.core.sql.rad;

import cl.dlab.sma.core.sql.BaseSQL;
import java.sql.Connection;

public class HojaDeDatos extends BaseSQL {

	public HojaDeDatos() throws Exception {
		super();
	}

	public HojaDeDatos(Connection con, java.lang.Boolean commitAndClose)
			throws Exception {
		super(con, commitAndClose);
	}
}