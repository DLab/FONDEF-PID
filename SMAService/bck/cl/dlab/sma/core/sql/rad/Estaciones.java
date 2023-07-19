package cl.dlab.sma.core.sql.rad;

import cl.dlab.sma.core.sql.BaseSQL;
import java.sql.Connection;

public class Estaciones extends BaseSQL {

	public Estaciones() throws Exception {
		super();
	}

	public Estaciones(Connection con, java.lang.Boolean commitAndClose)
			throws Exception {
		super(con, commitAndClose);
	}
}