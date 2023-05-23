package cl.dlab.pid.calidaddelaire;

public class FileVO {
	
	private String pathName;
	private String name;
	private byte[] bytes;

	public FileVO(String path, String name, byte[] bytes) {
		this.pathName = path;
		this.name = name;
		this.bytes = bytes;
	}

	public String getName() {
		return name;
	}

	public byte[] getBytes() {
		return bytes;
	}

	public String getPathName() {
		return pathName;
	}
}
