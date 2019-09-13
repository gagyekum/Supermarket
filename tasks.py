from invoke import task


@task
def test(context, k=None):
    cmd = 'pytest -v'

    if k:
        context.run(f'{cmd} -k {k}')
    else:
        context.run(cmd)


@task
def lint(context):
    context.run('flake8 backend')


@task(test, lint)
def build(context):
    print('Done building!!')


@task(build)
def run(context):
    context.run('python manage.py runserver 0.0.0.0:8000 --noreload')
