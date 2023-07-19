package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.VOBase;

public class EstacionesOutputVO extends VOBase {

	public void setId(java.lang.Integer id) {
		set("id", id);
	}

	public Integer getId() {
		return get("id");
	}

	public void setDescripcion(java.lang.String descripcion) {
		set("descripcion", descripcion);
	}

	public String getDescripcion() {
		return get("descripcion");
	}

	public void setIdRegulado(java.lang.Integer idRegulado) {
		set("idRegulado", idRegulado);
	}

	public Integer getIdRegulado() {
		return get("idRegulado");
	}

	public void setLongitud(java.lang.Double longitud) {
		set("longitud", longitud);
	}

	public Double getLongitud() {
		return get("longitud");
	}

	public void setLatitud(java.lang.Double latitud) {
		set("latitud", latitud);
	}

	public Double getLatitud() {
		return get("latitud");
	}
}