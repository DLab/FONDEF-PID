package cl.dlab.sma.core.sql.rad;

import cl.dlab.sma.core.sql.BaseSQL;
import java.sql.Connection;

public class BaseDatos extends BaseSQL {

	public BaseDatos() throws Exception {
		super();
	}

	public BaseDatos(Connection con, java.lang.Boolean commitAndClose)
			throws Exception {
		super(con, commitAndClose);
	}
}