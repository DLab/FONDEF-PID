// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  googleMapsApiKey: '',
  customers:[
            {
              title: 'dlab / SMA',
              background: 'linear-gradient(70deg,#b31417,#df7577)',
              backgroundColor: '#b31417',
              backgroundPrimaryBtnColor: '#b31417',
              favicon: 'assets/img/cienciavida_logo.png',
              logo: 'assets/img/logo.png',
              sideNaveWidth: '280px',
              downloadGestionContentType: 'xlsx',
              extraccionShowDatosFactura: false,
                    }
  ],
  selectedCustomer: 0,
  backend: '' // Put your backend here
};
