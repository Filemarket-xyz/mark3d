while true; do
    if [ $(docker inspect mark3d-indexer-postgres-migration-1 --format='{{.State.Status}}') == "exited" ]; then
        echo $(docker inspect mark3d-indexer-postgres-migration-1 --format='{{.State.Status}}')
        break
    fi
    done

echo $(docker inspect mark3d-indexer-postgres-migration-1 --format='{{.State.ExitCode}}')
docker logs mark3d-indexer-postgres-migration-1
exit $(docker inspect mark3d-indexer-postgres-migration-1 --format='{{.State.ExitCode}}')