package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.VOBase;

public class TipoOperacionOutputVO extends VOBase {

	public void setCodigo(java.lang.String codigo) {
		set("codigo", codigo);
	}

	public String getCodigo() {
		return get("codigo");
	}

	public void setDescripcion(java.lang.String descripcion) {
		set("descripcion", descripcion);
	}

	public String getDescripcion() {
		return get("descripcion");
	}

	public void setClasificacion(java.lang.String clasificacion) {
		set("clasificacion", clasificacion);
	}

	public String getClasificacion() {
		return get("clasificacion");
	}
}