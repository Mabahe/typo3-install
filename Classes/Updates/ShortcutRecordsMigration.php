<?php

declare(strict_types=1);

namespace TYPO3\CMS\Install\Updates;

/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

use TYPO3\CMS\Backend\Module\ModuleProvider;
use TYPO3\CMS\Backend\Routing\Router;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Database\Query\QueryBuilder;
use TYPO3\CMS\Core\Utility\GeneralUtility;

/**
 * @internal This class is only meant to be used within EXT:install and is not part of the TYPO3 Core API.
 */
class ShortcutRecordsMigration implements UpgradeWizardInterface
{
    private const TABLE_NAME = 'sys_be_shortcuts';

    protected ?ModuleProvider $moduleProvider = null;
    protected ?Router $router = null;

    public function getIdentifier(): string
    {
        return 'shortcutRecordsMigration';
    }

    public function getTitle(): string
    {
        return 'Migrate shortcut records to new format.';
    }

    public function getDescription(): string
    {
        return 'To support speaking urls in the backend, some fields need to be changed in sys_be_shortcuts.';
    }

    public function getPrerequisites(): array
    {
        return [
            DatabaseUpdatedPrerequisite::class,
        ];
    }

    public function updateNecessary(): bool
    {
        return $this->columnsExistInTable() && $this->hasRecordsToUpdate();
    }

    public function executeUpdate(): bool
    {
        $this->moduleProvider = GeneralUtility::makeInstance(ModuleProvider::class);
        $this->router = GeneralUtility::makeInstance(Router::class);
        $connection = $this->getConnectionPool()->getConnectionForTable(self::TABLE_NAME);

        foreach ($this->getRecordsToUpdate() as $record) {
            [$moduleName] = explode('|', (string)$record['module_name'], 2);

            if (!is_string($moduleName) || $moduleName === '') {
                continue;
            }

            if (($routeIdentifier = $this->getRouteIdentifierForModuleName($moduleName)) === '') {
                continue;
            }

            // Parse the url and reveal the arguments (query parameters)
            $parsedUrl = parse_url((string)$record['url']) ?: [];
            $arguments = [];
            parse_str($parsedUrl['query'] ?? '', $arguments);

            // Unset not longer needed arguments
            unset($arguments['route'], $arguments['returnUrl']);

            try {
                $encodedArguments = json_encode($arguments, JSON_THROW_ON_ERROR) ?: '';
            } catch (\JsonException $e) {
                // Skip the row if arguments can not be encoded
                continue;
            }

            // Update the record - Note: The "old" values won't be unset
            $connection->update(
                self::TABLE_NAME,
                ['route' => $routeIdentifier, 'arguments' => $encodedArguments],
                ['uid' => (int)$record['uid']]
            );
        }

        return true;
    }

    protected function columnsExistInTable(): bool
    {
        $schemaManager = $this->getConnectionPool()->getConnectionForTable(self::TABLE_NAME)->createSchemaManager();

        $tableColumns = $schemaManager->listTableColumns(self::TABLE_NAME);

        foreach (['module_name', 'url', 'route', 'arguments'] as $column) {
            if (!isset($tableColumns[$column])) {
                return false;
            }
        }

        return true;
    }

    protected function hasRecordsToUpdate(): bool
    {
        return (bool)$this->getPreparedQueryBuilder()->count('uid')->executeQuery()->fetchOne();
    }

    protected function getRecordsToUpdate(): array
    {
        return $this->getPreparedQueryBuilder()->select(...['uid', 'module_name', 'url'])->executeQuery()->fetchAllAssociative();
    }

    protected function getPreparedQueryBuilder(): QueryBuilder
    {
        $queryBuilder = $this->getConnectionPool()->getQueryBuilderForTable(self::TABLE_NAME);
        $queryBuilder->getRestrictions()->removeAll();
        $queryBuilder
            ->from(self::TABLE_NAME)
            ->where(
                $queryBuilder->expr()->neq('module_name', $queryBuilder->createNamedParameter('')),
                $queryBuilder->expr()->and(
                    $queryBuilder->expr()->neq('url', $queryBuilder->createNamedParameter('')),
                    $queryBuilder->expr()->isNotNull('url')
                ),
                $queryBuilder->expr()->eq('route', $queryBuilder->createNamedParameter('')),
                $queryBuilder->expr()->or(
                    $queryBuilder->expr()->eq('arguments', $queryBuilder->createNamedParameter('')),
                    $queryBuilder->expr()->isNull('arguments')
                )
            );

        return $queryBuilder;
    }

    protected function getRouteIdentifierForModuleName(string $moduleName): string
    {
        // Check static special cases first
        switch ($moduleName) {
            case 'xMOD_alt_doc.php':
                return 'record_edit';
            case 'file_edit':
            case 'wizard_rte':
                return $moduleName;
        }

        if ($this->moduleProvider->isModuleRegistered($moduleName)) {
            return $moduleName;
        }

        $alias = $this->router->getRouteCollection()->getAliases()[$moduleName] ?? null;
        if ($alias) {
            return $alias->getId();
        }
        return '';
    }

    protected function getConnectionPool(): ConnectionPool
    {
        return GeneralUtility::makeInstance(ConnectionPool::class);
    }
}
