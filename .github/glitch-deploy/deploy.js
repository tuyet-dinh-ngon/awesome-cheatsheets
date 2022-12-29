const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/sage-leaf-nail|https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/wobbly-awesome-raincoat|https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/romantic-thin-wedelia|https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/road-fuzzy-forgery|https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/fishy-deeply-cough|https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/therapeutic-catnip-pressure|https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/debonair-blushing-sunspot|https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/cubic-accidental-sawfish|https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/rustic-checkered-feet|https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/perpetual-spring-banana|https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/helix-brook-gemini|https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/shadow-polished-pyjama|https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/cream-handsome-quokka|https://30d2b982-43d6-47a3-829e-9be3eb133381@api.glitch.com/git/coherent-flint-radar`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();