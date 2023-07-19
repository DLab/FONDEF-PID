package cl.dlab.sma.core.sql.rad;

import cl.dlab.sma.core.sql.BaseSQL;
import java.sql.Connection;

public class ValidacionesNormativas extends BaseSQL {

	public ValidacionesNormativas() throws Exception {
		super();
	}

	public ValidacionesNormativas(Connection con,
			java.lang.Boolean commitAndClose) throws Exception {
		super(con, commitAndClose);
	}
}