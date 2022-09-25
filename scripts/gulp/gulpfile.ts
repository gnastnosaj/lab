// tslint:disable:no-import-side-effect
import { task, series } from 'gulp';
import { execNodeTask } from './util/task-helpers';
import * as fs from 'fs-extra';

task('copy-resource', done => {
    const themes = fs.readdirSync('./src/theme');
    themes.forEach(theme => {
        if (theme.endsWith('.less')) {
            let style = String(fs.readFileSync(`./src/theme/${theme}`));
            style = style.replace('../less/ng-zorro-antd.less', '../../../node_modules/ng-zorro-antd/ng-zorro-antd.less');
            fs.writeFileSync(`./src/assets/styles/${theme}`, style);
        }
    });
    done();
});

task('build-theme', done => {
    const styles = fs.readdirSync('./src/assets/styles');
    const promises = styles.filter(style => style.endsWith('.less') && style !== 'theme.less')
        .map(style => new Promise<void>((resolve, reject) => {
            execNodeTask(
                'less',
                'lessc',
                ['--js', `./src/assets/styles/${style}`, `./src/assets/styles/${style}`.replace('.less', '.css')]
            )(error => {
                if (error != null) {
                    reject(error);
                } else {
                    fs.unlinkSync(`./src/assets/styles/${style}`);
                    resolve();
                }
            });
        }));
    Promise.all(promises).then(() => {
        fs.unlinkSync('./src/assets/styles/theme.less');
        done();
    }, error => {
        fs.unlinkSync('./src/assets/styles/theme.less');
        done(error);
    });
});

task('build-magneto', execNodeTask(
    'typescript',
    'tsc',
    ['--build', 'src/tsconfig.magneto.json']
));

task('webpack-engine', execNodeTask(
    'webpack',
    'webpack',
    [],
    {},
    `${__dirname}/../../out-tsc/magneto`
));

task('build-engine', series(
    'build-magneto',
    'webpack-engine'
));

task('copy-engine', done => {
    const engines = fs.readdirSync('./out-tsc/magneto/dist/engine');
    engines.forEach(engine => {
        fs.createReadStream(`./out-tsc/magneto/dist/engine/${engine}`).pipe(fs.createWriteStream(`./dist/lab/magneto/engine/${engine}`));
    });
    done();
});

task('update-engine', series(
    'build-engine',
    'copy-engine'
));

task('serve-project', execNodeTask(
    '@angular/cli',
    'ng',
    ['serve', '--ssl']
));

task('build-project', execNodeTask(
    '@angular/cli',
    'ng',
    ['build', '--base-href=./', '--deploy-url=./', '--prod']
));

task('make-project', execNodeTask(
    '@angular/cli',
    'ng',
    ['build', '--base-href=./', '--deploy-url=./', '--configuration=electron']
));

task('serve', series(
    'copy-resource',
    'build-theme',
    'build-engine',
    'serve-project'
));

task('build', series(
    'copy-resource',
    'build-theme',
    'build-engine',
    'build-project'
));

task('make', series(
    'copy-resource',
    'build-theme',
    'build-engine',
    'make-project'
));
