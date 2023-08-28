package cl.dlab.sma.core.sql.rad;

import cl.dlab.sma.core.sql.BaseSQL;
import java.sql.Connection;

public class MonitoreoOcurrencia extends BaseSQL {

	public MonitoreoOcurrencia() throws Exception {
		super();
	}

	public MonitoreoOcurrencia(Connection con, java.lang.Boolean commitAndClose)
			throws Exception {
		super(con, commitAndClose);
	}
}