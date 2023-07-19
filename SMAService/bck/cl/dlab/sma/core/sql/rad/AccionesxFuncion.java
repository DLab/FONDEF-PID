package cl.dlab.sma.core.sql.rad;

import cl.dlab.sma.core.sql.BaseSQL;
import java.sql.Connection;

public class AccionesxFuncion extends BaseSQL {

	public AccionesxFuncion() throws Exception {
		super();
	}

	public AccionesxFuncion(Connection con, java.lang.Boolean commitAndClose)
			throws Exception {
		super(con, commitAndClose);
	}
}