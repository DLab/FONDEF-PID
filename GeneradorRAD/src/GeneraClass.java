import org.jboss.forge.roaster.Roaster;
import org.jboss.forge.roaster.model.source.JavaClassSource;

public class GeneraClass
{
	public static void main(String[] args) 
	{
		final JavaClassSource javaClass = Roaster.create(JavaClassSource.class);
		javaClass.setPackage("com.company.example").setName("Person");

		javaClass.extendSuperType(LeeExp.class);
		javaClass.addField()
		  .setName("serialVersionUID")
		  .setType("long")
		  .setLiteralInitializer("1L")
		  .setPrivate()
		  .setStatic(true)
		  .setFinal(true);

		javaClass.addProperty(Integer.class, "id").setMutable(false);
		javaClass.addProperty(String.class, "firstName");
		javaClass.addProperty("String", "lastName");

		javaClass.addMethod()
		  .setConstructor(true)
		  .setPublic()
		  .setBody("this.id = id;")
		  .addParameter(Integer.class, "id");
		
		javaClass.addMethod()
		  .setName("setName")
		  .setPublic()
		  .setBody("setName(\"name\", name);")
		  
		  .addParameter(String.class, "name");
		  

		
		System.out.println(javaClass);
	}
}
