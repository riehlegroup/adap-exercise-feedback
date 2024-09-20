FROM node:22

# Simulate CI mode so tests don't run in watch mode
ENV CI=true

# Setup folders and switch to non-root user
RUN mkdir /template /student /workdir /results && \
    chown node:node -R /template /student /workdir /results
USER node

# Copy exercise solution
WORKDIR /workdir
ARG EXERCISE=b01
COPY ../data/$EXERCISE/repositories/solution /template

# Copy solution template into workdir without solutions and only with the relevant exercises
RUN cp -r /template/* .
## Remove every solution folder
RUN find ./src -type d -name "solution" -exec rm -rf {} +
## Remove everything directly under /solution/src that does not match the pattern /solution/src/adap-${exercise}-*
RUN find ./src -mindepth 1 -maxdepth 1 -type d ! -name "adap-$EXERCISE-*" -exec rm -rf {} +
## Remove everything directly under /solution/test that does not match the pattern /solution/test/adap-${exercise}-*
RUN find ./test -mindepth 1 -maxdepth 1 -type d ! -name "adap-$EXERCISE-*" -exec rm -rf {} +


# Install dependencies
RUN npm ci

# Fix import paths from solution
## Replace 'solution' with 'public' in all relevant import lines in files under ./test
RUN find ./test -type f -exec sed -i 's|import {\([^}]*\)} from "\(.*\)/solution/\(.*\)"|import {\1} from "\2/public/\3"|g' {} +

CMD \
    find /student/src -mindepth 1 -maxdepth 1 -type d ! -name "adap-$EXERCISE-*" -exec cp -r {} ./src/ \; && \
    npm run test -- --reporter=verbose --reporter=json --outputFile.json=/results/exercise.json
