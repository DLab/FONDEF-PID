package cl.dlab.sma.util;

public class Param {
	private String key;
	private Object value;
	
	public Param(String key, Object value)
	{
		this.key = key;
		this.value = value;
	}
	
	public String getKey() {
		return key;
	}

	public Param setKey(String key) {
		this.key = key;
		return this;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}
	
}
