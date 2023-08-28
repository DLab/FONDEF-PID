package cl.dlab.sma.core.sql.rad;

import cl.dlab.sma.core.sql.BaseSQL;
import java.sql.Connection;

public class Clasificacion extends BaseSQL {

	public Clasificacion() throws Exception {
		super();
	}

	public Clasificacion(Connection con, java.lang.Boolean commitAndClose)
			throws Exception {
		super(con, commitAndClose);
	}
}