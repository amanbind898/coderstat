// tests/unit/db/schema.test.js
import {
    ProfileData,
    CodingPlatformStats,
    UserQuestionProgress,
    codingPlatformStatsRelations,
    userQuestionProgressRelations
  } from '@/db/schema'
  import { relations } from 'drizzle-orm'
  import { describe, expect, it } from '@jest/globals'
  
  describe('Database Schema Validation', () => {
    describe('ProfileData Table', () => {
      it('should have correct columns', () => {
        expect(ProfileData).toHaveProperty('id')
        expect(ProfileData.id.primary).toBe(true)
        
        expect(ProfileData.clerkId).toMatchObject({
          dataType: 'varchar',
          notNull: false
        })
        
        expect(ProfileData.primaryEmail).toMatchObject({
          dataType: 'varchar',
          notNull: true
        })
      })
    })
  
    describe('CodingPlatformStats Table', () => {
      it('should have required platform stats columns', () => {
        expect(CodingPlatformStats.clerkId).toMatchObject({
          dataType: 'varchar',
          notNull: true
        })
        
        expect(CodingPlatformStats.easyCount.default).toBe('0')
        expect(CodingPlatformStats.rating).toMatchObject({
          dataType: 'varchar',
          notNull: false
        })
      })
    })
  
    describe('UserQuestionProgress Table', () => {
      it('should have proper question tracking fields', () => {
        expect(UserQuestionProgress.status).toMatchObject({
          dataType: 'varchar',
          notNull: true,
          default: 'not_started'
        })
        
        expect(UserQuestionProgress.timesAttempted.default).toBe(0)
      })
    })
  })
  
  describe('Database Relations Validation', () => {
    describe('CodingPlatformStats Relations', () => {
      it('should have correct profile relation', () => {
        const relationConfig = codingPlatformStatsRelations(ProfileData)
        expect(relationConfig.profile).toMatchObject({
          fields: ['clerkId'],
          references: ['clerkId']
        })
      })
  
      it('should have many-to-many questions relation', () => {
        const relationConfig = codingPlatformStatsRelations(CodingPlatformStats)
        expect(relationConfig.questions.relationType).toBe('many')
      })
    })
  
    describe('UserQuestionProgress Relations', () => {
      it('should link to MasterQuestions', () => {
        const relationConfig = userQuestionProgressRelations(UserQuestionProgress)
        expect(relationConfig.question.fields).toEqual(['questionId'])
        expect(relationConfig.question.references).toEqual(['id'])
      })
    })
  })
  
  describe('Schema Constraints Validation', () => {
    it('should enforce foreign key constraints', () => {
      const questionIdColumn = UserQuestionProgress.questionId
      expect(questionIdColumn.references()).toEqual({
        table: 'MasterQuestions',
        column: 'id'
      })
    })
  
    it('should have correct default values', () => {
      expect(ProfileData.isPublic.default).toBe(true)
      expect(CodingPlatformStats.solvedCount.default).toBe('0')
      expect(UserQuestionProgress.confidence.default).toBe(0)
    })
  })
  